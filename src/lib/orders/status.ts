export const PAYMENT_METHODS = ["Wave", "Orange Money", "Espèces à la livraison"] as const;
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export const PAYMENT_STATUS = {
  awaiting_payment: "En attente de paiement",
  pending_verification: "Paiement à vérifier",
  confirmed: "Paiement confirmé",
  refused: "Paiement refusé",
  cash_on_delivery: "À payer à la livraison",
  cash_received: "Paiement reçu à la livraison",
} as const;
export type PaymentStatus = keyof typeof PAYMENT_STATUS;

export const ORDER_STATUS = {
  new: "Nouvelle commande",
  preparing: "En préparation",
  ready: "Prête",
  with_courier: "Remise au livreur",
  delivered: "Livrée",
  cancelled: "Annulée",
} as const;
export type OrderStatus = keyof typeof ORDER_STATUS;

export function paymentStatusLabel(status: string): string {
  return PAYMENT_STATUS[status as PaymentStatus] ?? status;
}

export function orderStatusLabel(status: string): string {
  return ORDER_STATUS[status as OrderStatus] ?? status;
}

export function isMobileMoney(method: string): boolean {
  return method === "Wave" || method === "Orange Money";
}
