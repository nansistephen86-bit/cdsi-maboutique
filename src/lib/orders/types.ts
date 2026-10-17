export type OrderRecord = {
  id: number;
  order_number: string;
  user_id: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  address: string;
  city: string;
  subtotal: number;
  delivery_fee: number;
  total: number;
  payment_method: string;
  payment_status: string;
  order_status: string;
  created_at: string;
  updated_at: string;
};

export type OrderItemRecord = {
  id: number;
  order_id: number;
  product_id: string;
  name: string;
  unit_price: number;
  quantity: number;
  color: string | null;
  size: string | null;
};

export type StatusEventRecord = {
  id: number;
  order_id: number;
  field: string;
  old_value: string | null;
  new_value: string;
  actor_user_id: string;
  actor_email: string | null;
  created_at: string;
};

export type OrderDetail = OrderRecord & {
  items: OrderItemRecord[];
  events: StatusEventRecord[];
};

export type OrderSummary = OrderRecord & {
  items: OrderItemRecord[];
};
