export type PaymentPrefs = {
  defaultMethod: "card" | "invoice" | "cash" | "bank";
  autoInvoiceOnConfirm: boolean;
  includeFee: boolean;
  invoiceEmailTpl: string;
};

export const defaultPaymentPrefs: PaymentPrefs = {
  defaultMethod: "invoice",
  autoInvoiceOnConfirm: true,
  includeFee: false,
  invoiceEmailTpl: "Здравствуйте, {{client.name}}!\nВо вложении счёт {{invoice.number}} на сумму {{invoice.total}}.",
};

export const LS_KEY_PAY = "demo_manager_settings_payments_v1";