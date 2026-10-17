import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getProductById } from "@/data/products";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import { notifyNewOrder, notifyPaymentConfirmed } from "@/lib/orders/notify.server";
import {
  isMobileMoney,
  PAYMENT_METHODS,
  type OrderStatus,
  type PaymentStatus,
} from "@/lib/orders/status";
import type { OrderDetail, OrderItemRecord, OrderRecord, OrderSummary, StatusEventRecord } from "@/lib/orders/types";
import { getPaymentSettings, isAdminEmail } from "@/lib/payments/config.server";

const cartItemSchema = z.object({
  id: z.string(),
  quantity: z.number().int().min(1).max(99),
  color: z.string().nullable().optional(),
  size: z.string().nullable().optional(),
});

const checkoutSchema = z.object({
  name: z.string().trim().min(2).max(120),
  phone: z.string().trim().min(8).max(30),
  email: z.string().trim().max(120).optional(),
  address: z.string().trim().min(4).max(240),
  city: z.string().trim().min(2).max(80),
  payment: z.enum(PAYMENT_METHODS),
  items: z.array(cartItemSchema).min(1),
});

async function lookupEmail(userId: string): Promise<string | null> {
  const sql = await getSql();
  const rows = await sql<{ email: string | null }>`
    select email from "user" where id = ${userId} limit 1
  `;
  return rows[0]?.email ?? null;
}

async function requireAdmin(userId: string): Promise<{ email: string | null }> {
  const email = await lookupEmail(userId);
  if (!isAdminEmail(email)) {
    throw new Error("Forbidden");
  }
  return { email };
}

function padSeq(n: number): string {
  return String(n).padStart(5, "0");
}

function serializeOrder(row: OrderRecord, items: OrderItemRecord[], events: StatusEventRecord[] = []): OrderDetail {
  return { ...row, items, events };
}

export const getPublicPaymentSettings = createServerFn({ method: "GET" }).handler(async () => {
  const s = getPaymentSettings();
  return {
    wavePhone: s.wavePhone,
    waveName: s.waveName,
    waveQrUrl: s.waveQrUrl,
    orangePhone: s.orangePhone,
    orangeName: s.orangeName,
    orangeQrUrl: s.orangeQrUrl,
    deliveryFee: s.deliveryFee,
  };
});

export const getMyAccount = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const email = await lookupEmail(context.userId);
    const profile = await sql<{
      name: string | null;
      phone: string | null;
      address: string | null;
      city: string | null;
    }>`
      select name, phone, address, city from customer_profiles where user_id = ${context.userId} limit 1
    `;
    return {
      userId: context.userId,
      email,
      isAdmin: isAdminEmail(email),
      profile: profile[0] ?? null,
    };
  });

export const createOrder = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => checkoutSchema.parse(input))
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const settings = getPaymentSettings();
    const accountEmail = await lookupEmail(context.userId);

    const lines: Array<{
      product_id: string;
      name: string;
      unit_price: number;
      quantity: number;
      color: string | null;
      size: string | null;
    }> = [];
    let subtotal = 0;
    for (const item of data.items) {
      const product = getProductById(item.id);
      if (!product || !product.available) {
        throw new Error(`Produit indisponible : ${item.id}`);
      }
      subtotal += product.price * item.quantity;
      lines.push({
        product_id: product.id,
        name: product.name,
        unit_price: product.price,
        quantity: item.quantity,
        color: item.color ?? null,
        size: item.size ?? null,
      });
    }

    const deliveryFee = settings.deliveryFee;
    const total = subtotal + deliveryFee;
    const year = new Date().getFullYear();
    const seqRows = await sql.query<{ last_seq: number }>(
      `insert into order_counters (year, last_seq) values ($1, 1)
       on conflict (year) do update set last_seq = order_counters.last_seq + 1
       returning last_seq`,
      [year],
    );
    const seq = seqRows[0]?.last_seq ?? 1;
    const orderNumber = `CDSI-${year}-${padSeq(seq)}`;

    const paymentStatus: PaymentStatus = isMobileMoney(data.payment)
      ? "awaiting_payment"
      : "cash_on_delivery";
    const customerEmail = data.email || accountEmail || null;

    const inserted = await sql<OrderRecord>`
      insert into orders (
        order_number, user_id, customer_name, customer_phone, customer_email,
        address, city, subtotal, delivery_fee, total,
        payment_method, payment_status, order_status
      ) values (
        ${orderNumber}, ${context.userId}, ${data.name}, ${data.phone}, ${customerEmail},
        ${data.address}, ${data.city}, ${subtotal}, ${deliveryFee}, ${total},
        ${data.payment}, ${paymentStatus}, ${"new"}
      )
      returning *
    `;
    const order = inserted[0];
    if (!order) throw new Error("Impossible d'enregistrer la commande");

    for (const line of lines) {
      await sql`
        insert into order_items (order_id, product_id, name, unit_price, quantity, color, size)
        values (
          ${order.id}, ${line.product_id}, ${line.name}, ${line.unit_price},
          ${line.quantity}, ${line.color}, ${line.size}
        )
      `;
    }

    await sql`
      insert into order_status_events (order_id, field, old_value, new_value, actor_user_id, actor_email)
      values (
        ${order.id}, ${"order_status"}, ${null}, ${"new"},
        ${context.userId}, ${accountEmail}
      )
    `;
    await sql`
      insert into order_status_events (order_id, field, old_value, new_value, actor_user_id, actor_email)
      values (
        ${order.id}, ${"payment_status"}, ${null}, ${paymentStatus},
        ${context.userId}, ${accountEmail}
      )
    `;

    await sql`
      insert into customer_profiles (user_id, name, phone, address, city, updated_at)
      values (${context.userId}, ${data.name}, ${data.phone}, ${data.address}, ${data.city}, now())
      on conflict (user_id) do update set
        name = excluded.name,
        phone = excluded.phone,
        address = excluded.address,
        city = excluded.city,
        updated_at = now()
    `;

    const items = await sql<OrderItemRecord>`
      select * from order_items where order_id = ${order.id} order by id
    `;

    try {
      await notifyNewOrder(order, items);
    } catch (err) {
      console.error("[orders] notify failed", err);
    }

    return { orderNumber: order.order_number };
  });

export const listMyOrders = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const orders = await sql<OrderRecord>`
      select * from orders where user_id = ${context.userId} order by created_at desc
    `;
    const summaries: OrderSummary[] = [];
    for (const order of orders) {
      const items = await sql<OrderItemRecord>`
        select * from order_items where order_id = ${order.id} order by id
      `;
      summaries.push({ ...order, items });
    }
    return summaries;
  });

export const getMyOrder = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((input: unknown) => z.object({ numero: z.string() }).parse(input))
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const email = await lookupEmail(context.userId);
    const admin = isAdminEmail(email);
    const rows = await sql<OrderRecord>`
      select * from orders where order_number = ${data.numero} limit 1
    `;
    const order = rows[0];
    if (!order) return null;
    if (order.user_id !== context.userId && !admin) {
      throw new Error("Forbidden");
    }
    const items = await sql<OrderItemRecord>`
      select * from order_items where order_id = ${order.id} order by id
    `;
    const events = await sql<StatusEventRecord>`
      select * from order_status_events where order_id = ${order.id} order by created_at asc
    `;
    return serializeOrder(order, items, events);
  });

export const markPaymentDone = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => z.object({ numero: z.string() }).parse(input))
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const email = await lookupEmail(context.userId);
    const rows = await sql<OrderRecord>`
      select * from orders where order_number = ${data.numero} and user_id = ${context.userId} limit 1
    `;
    const order = rows[0];
    if (!order) throw new Error("Commande introuvable");
    if (!isMobileMoney(order.payment_method)) {
      throw new Error("Cette commande ne se paie pas en ligne");
    }
    if (order.payment_status !== "awaiting_payment") {
      return { paymentStatus: order.payment_status };
    }
    await sql`
      update orders set payment_status = ${"pending_verification"}, updated_at = now()
      where id = ${order.id} and user_id = ${context.userId}
    `;
    await sql`
      insert into order_status_events (order_id, field, old_value, new_value, actor_user_id, actor_email)
      values (
        ${order.id}, ${"payment_status"}, ${order.payment_status}, ${"pending_verification"},
        ${context.userId}, ${email}
      )
    `;
    return { paymentStatus: "pending_verification" as PaymentStatus };
  });

export const listAdminOrders = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await requireAdmin(context.userId);
    const sql = await getSql();
    return sql<OrderRecord>`select * from orders order by created_at desc`;
  });

export const updateAdminPaymentStatus = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) =>
    z
      .object({
        numero: z.string(),
        status: z.enum([
          "awaiting_payment",
          "pending_verification",
          "confirmed",
          "refused",
          "cash_on_delivery",
          "cash_received",
        ]),
      })
      .parse(input),
  )
  .handler(async ({ context, data }) => {
    const { email } = await requireAdmin(context.userId);
    const sql = await getSql();
    const rows = await sql<OrderRecord>`
      select * from orders where order_number = ${data.numero} limit 1
    `;
    const order = rows[0];
    if (!order) throw new Error("Commande introuvable");
    if (order.payment_status === data.status) return { paymentStatus: order.payment_status };

    await sql`
      update orders set payment_status = ${data.status}, updated_at = now()
      where id = ${order.id}
    `;
    await sql`
      insert into order_status_events (order_id, field, old_value, new_value, actor_user_id, actor_email)
      values (
        ${order.id}, ${"payment_status"}, ${order.payment_status}, ${data.status},
        ${context.userId}, ${email}
      )
    `;

    if (data.status === "confirmed" && order.payment_status !== "confirmed") {
      try {
        await notifyPaymentConfirmed({ ...order, payment_status: data.status });
      } catch (err) {
        console.error("[orders] payment confirm mail failed", err);
      }
    }
    return { paymentStatus: data.status };
  });

export const updateAdminOrderStatus = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) =>
    z
      .object({
        numero: z.string(),
        status: z.enum(["new", "preparing", "ready", "with_courier", "delivered", "cancelled"]),
      })
      .parse(input),
  )
  .handler(async ({ context, data }) => {
    const { email } = await requireAdmin(context.userId);
    const sql = await getSql();
    const rows = await sql<OrderRecord>`
      select * from orders where order_number = ${data.numero} limit 1
    `;
    const order = rows[0];
    if (!order) throw new Error("Commande introuvable");
    if (order.order_status === data.status) return { orderStatus: order.order_status };

    await sql`
      update orders set order_status = ${data.status}, updated_at = now()
      where id = ${order.id}
    `;
    await sql`
      insert into order_status_events (order_id, field, old_value, new_value, actor_user_id, actor_email)
      values (
        ${order.id}, ${"order_status"}, ${order.order_status}, ${data.status},
        ${context.userId}, ${email}
      )
    `;
    return { orderStatus: data.status };
  });
