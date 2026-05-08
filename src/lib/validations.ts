// Schemas de validación Zod — importables desde Client y Server Components
// SIN "use server" para poder exportar objetos y tipos

import { z } from "zod";

export const clientSchema = z.object({
  firstName: z.string().min(1, "El nombre es requerido").max(100),
  lastName: z.string().min(1, "El apellido es requerido").max(100),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  phone: z.string().max(30).optional().or(z.literal("")),
  address: z.string().max(255).optional().or(z.literal("")),
  notes: z.string().max(1000).optional().or(z.literal("")),
  hairNotes: z.string().max(1000).optional().or(z.literal("")),
});
export type ClientFormData = z.infer<typeof clientSchema>;

// ── Catálogo de servicios ─────────────────────────────────

export const serviceSchema = z.object({
  name: z.string().min(1, "El nombre del servicio es requerido").max(100),
  description: z.string().max(500).optional().or(z.literal("")),
  durationMinutes: z.number().int().min(5, "Mínimo 5 minutos").max(480),
  price: z.number().min(0, "El precio no puede ser negativo"),
  isActive: z.boolean().default(true),
});
export type ServiceFormData = z.infer<typeof serviceSchema>;

// ── Citas ─────────────────────────────────────────────────

export const appointmentSchema = z.object({
  clientId: z.string().min(1, "Selecciona un cliente"),
  barberId: z.string().optional().or(z.literal("")),
  serviceId: z.string().optional().or(z.literal("")),
  date: z.string().min(1, "La fecha es requerida"), // ISO datetime string
  durationMinutes: z.number().int().min(5).max(480).default(30),
  status: z
    .enum(["PENDING", "CONFIRMED", "IN_PROGRESS", "COMPLETED", "CANCELLED"])
    .default("PENDING"),
  notes: z.string().max(1000).optional().or(z.literal("")),
  tip: z.number().min(0).optional().nullable(),
});
export type AppointmentFormData = z.infer<typeof appointmentSchema>;

// ── Factura ──────────────────────────────────────────────

export const lineItemSchema = z.object({
  description: z.string().min(1, "La descripción es requerida").max(255),
  quantity: z.number().positive("La cantidad debe ser mayor a 0"),
  unitPrice: z.number().min(0, "El precio no puede ser negativo"),
  itemType: z.enum(["CORTE", "PRODUCTO", "OTHER"]),
});

export type LineItemData = z.infer<typeof lineItemSchema>;

export const invoiceSchema = z.object({
  clientId: z.string().min(1, "Selecciona un cliente"),
  appointmentId: z.string().optional().or(z.literal("")),
  lineItems: z
    .array(lineItemSchema)
    .min(1, "Agrega al menos una línea de servicio"),
  taxRate: z.number().min(0).max(1), // 0.14975 = TPS+TVQ Quebec
  notes: z.string().max(1000).optional().or(z.literal("")),
  dueAt: z.string().optional().or(z.literal("")), // ISO date string
});

export type InvoiceFormData = z.infer<typeof invoiceSchema>;

// ── Recordatorio de cita ──────────────────────────────────

export const reminderSchema = z.object({
  clientId: z.string().min(1, "Selecciona un cliente"),
  serviceType: z.string().min(1, "El tipo de servicio es requerido").max(100),
  dueDate: z.string().optional().or(z.literal("")), // ISO date string
  notes: z.string().max(500).optional().or(z.literal("")),
});

export type ReminderFormData = z.infer<typeof reminderSchema>;

// ── Documentos contables ──────────────────────────────────

export const DOC_CATEGORIES = [
  { value: "INVOICES", label: "Facturas" },
  { value: "RECEIPTS", label: "Recibos" },
  { value: "PAYROLL", label: "Nómina" },
  { value: "TAX_DOCUMENTS", label: "Documentos Fiscales" },
  { value: "BANK_STATEMENTS", label: "Estados de Cuenta" },
  { value: "OTHER", label: "Otros" },
] as const;

export type DocCategory = (typeof DOC_CATEGORIES)[number]["value"];
