import { getAppointmentById, updateAppointmentStatus } from "@/actions/appointments";
import { formatDate, formatCurrency } from "@/lib/utils";
import Link from "next/link";
import {
  ChevronLeft,
  Calendar,
  Clock,
  User,
  Scissors,
  FileText,
  Plus,
} from "lucide-react";

const STATUS_BADGE: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700",
  CONFIRMED: "bg-blue-100 text-blue-700",
  IN_PROGRESS: "bg-violet-100 text-violet-700",
  COMPLETED: "bg-emerald-100 text-emerald-700",
  CANCELLED: "bg-slate-100 text-slate-500",
};

const STATUS_LABEL: Record<string, string> = {
  PENDING: "Pendiente",
  CONFIRMED: "Confirmada",
  IN_PROGRESS: "En progreso",
  COMPLETED: "Completada",
  CANCELLED: "Cancelada",
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AppointmentDetailPage({ params }: PageProps) {
  const { id } = await params;
  const appointment = await getAppointmentById(id);

  const canConfirm = appointment.status === "PENDING";
  const canStart = appointment.status === "CONFIRMED";
  const canComplete = appointment.status === "IN_PROGRESS";
  const canCancel =
    appointment.status !== "COMPLETED" &&
    appointment.status !== "CANCELLED";

  async function handleStatus(status: string) {
    "use server";
    await updateAppointmentStatus(id, status);
  }

  return (
    <div className="max-w-3xl space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-start justify-between">
        <div>
          <Link
            href="/appointments"
            className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 mb-2 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Citas
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900">
              Cita — {appointment.client.firstName} {appointment.client.lastName}
            </h1>
            <span
              className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_BADGE[appointment.status] ?? "bg-slate-100 text-slate-500"}`}
            >
              {STATUS_LABEL[appointment.status] ?? appointment.status}
            </span>
          </div>
          <p className="text-slate-500 text-sm mt-1">
            {formatDate(appointment.date)}
          </p>
        </div>

        {/* Edit link */}
        <Link
          href={`/appointments/${id}/edit`}
          className="flex items-center gap-1.5 border border-slate-300 hover:border-slate-400 text-slate-700 text-sm font-medium px-3 py-2 rounded-lg transition-colors"
        >
          Editar
        </Link>
      </div>

      {/* Info cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Client */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center gap-2 mb-3">
            <User className="w-4 h-4 text-slate-400" />
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
              Cliente
            </p>
          </div>
          <Link
            href={`/clients/${appointment.clientId}`}
            className="font-semibold text-blue-600 hover:underline"
          >
            {appointment.client.firstName} {appointment.client.lastName}
          </Link>
          {appointment.client.phone && (
            <p className="text-sm text-slate-600 mt-1">
              {appointment.client.phone}
            </p>
          )}
          {appointment.client.email && (
            <p className="text-sm text-slate-500">{appointment.client.email}</p>
          )}
        </div>

        {/* Appointment details */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="w-4 h-4 text-slate-400" />
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
              Detalles
            </p>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-700">
                {formatDate(appointment.date)} · {appointment.durationMinutes} min
              </span>
            </div>
            {appointment.barber && (
              <div className="flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-700">{appointment.barber.name}</span>
              </div>
            )}
            {appointment.service && (
              <div className="flex items-center gap-2">
                <Scissors className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-700">
                  {appointment.service.name} —{" "}
                  {formatCurrency(Number(appointment.service.price))}
                </span>
              </div>
            )}
            {appointment.tip && (
              <div className="flex items-center gap-2 text-emerald-700 font-medium">
                <span className="text-slate-400 font-normal">Propina:</span>
                {formatCurrency(Number(appointment.tip))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Notes */}
      {appointment.notes && (
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
            Notas
          </p>
          <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
            {appointment.notes}
          </p>
        </div>
      )}

      {/* Status actions */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h2 className="font-semibold text-slate-900 mb-4">Cambiar estado</h2>
        <div className="flex flex-wrap gap-2">
          {canConfirm && (
            <form action={handleStatus.bind(null, "CONFIRMED")}>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Confirmar
              </button>
            </form>
          )}
          {canStart && (
            <form action={handleStatus.bind(null, "IN_PROGRESS")}>
              <button
                type="submit"
                className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                En progreso
              </button>
            </form>
          )}
          {canComplete && (
            <form action={handleStatus.bind(null, "COMPLETED")}>
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Completar
              </button>
            </form>
          )}
          {canCancel && (
            <form action={handleStatus.bind(null, "CANCELLED")}>
              <button
                type="submit"
                className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-lg transition-colors"
              >
                Cancelar
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Invoice */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-slate-400" />
            <h2 className="font-semibold text-slate-900">Factura</h2>
          </div>
          {!appointment.invoice && (
            <Link
              href={`/invoices/new?appointmentId=${appointment.id}&clientId=${appointment.clientId}`}
              className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Crear factura
            </Link>
          )}
        </div>

        {appointment.invoice ? (
          <Link
            href={`/invoices/${appointment.invoice.id}`}
            className="flex items-center justify-between px-4 py-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <div>
              <p className="text-sm font-medium text-slate-900">
                {appointment.invoice.invoiceNumber}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                {STATUS_LABEL_INVOICE[appointment.invoice.status] ??
                  appointment.invoice.status}
              </p>
            </div>
            <span className="text-sm font-semibold text-slate-900">
              {formatCurrency(Number(appointment.invoice.total))}
            </span>
          </Link>
        ) : (
          <p className="text-sm text-slate-400">
            No hay factura asociada a esta cita.
          </p>
        )}
      </div>
    </div>
  );
}

const STATUS_LABEL_INVOICE: Record<string, string> = {
  DRAFT: "Borrador",
  SENT: "Enviada",
  PAID: "Pagada",
  OVERDUE: "Vencida",
  CANCELLED: "Cancelada",
};
