import Link from "next/link";
import { Calendar, Plus } from "lucide-react";
import { getAppointments } from "@/actions/appointments";
import { formatDate, formatCurrency } from "@/lib/utils";

const STATUS_TABS = [
  { value: "ALL", label: "Todas" },
  { value: "PENDING", label: "Pendiente" },
  { value: "CONFIRMED", label: "Confirmada" },
  { value: "IN_PROGRESS", label: "En progreso" },
  { value: "COMPLETED", label: "Completada" },
  { value: "CANCELLED", label: "Cancelada" },
];

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
  searchParams: Promise<{ status?: string }>;
}

export default async function AppointmentsPage({ searchParams }: PageProps) {
  const { status } = await searchParams;
  const activeTab = status ?? "ALL";
  const appointments = await getAppointments(activeTab);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Citas</h1>
          <p className="text-slate-500 text-sm mt-1">
            {appointments.length} cita{appointments.length !== 1 ? "s" : ""}
            {activeTab !== "ALL"
              ? ` · ${STATUS_LABEL[activeTab] ?? activeTab}`
              : ""}
          </p>
        </div>
        <Link
          href="/appointments/new"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nueva cita
        </Link>
      </div>

      {/* Status tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-lg w-fit flex-wrap">
        {STATUS_TABS.map((tab) => (
          <Link
            key={tab.value}
            href={
              tab.value === "ALL"
                ? "/appointments"
                : `/appointments?status=${tab.value}`
            }
            className={[
              "px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
              activeTab === tab.value
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-700",
            ].join(" ")}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {/* Appointments list */}
      {appointments.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-medium">
            {activeTab === "ALL"
              ? "No hay citas todavía"
              : `No hay citas en estado "${STATUS_LABEL[activeTab] ?? activeTab}"`}
          </p>
          {activeTab === "ALL" && (
            <Link
              href="/appointments/new"
              className="mt-4 inline-flex items-center gap-2 text-blue-600 hover:underline text-sm"
            >
              <Plus className="w-4 h-4" />
              Crear primera cita
            </Link>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          {/* Table header */}
          <div className="hidden sm:grid grid-cols-[1fr_160px_160px_120px_100px_90px] gap-4 px-5 py-3 bg-slate-50 border-b border-slate-200 text-xs font-medium text-slate-500 uppercase">
            <span>Cliente</span>
            <span>Barbero</span>
            <span>Servicio</span>
            <span>Fecha</span>
            <span>Estado</span>
            <span className="text-right">Propina</span>
          </div>

          <div className="divide-y divide-slate-100">
            {appointments.map((appt) => (
              <Link
                key={appt.id}
                href={`/appointments/${appt.id}`}
                className="grid grid-cols-[1fr_auto] sm:grid-cols-[1fr_160px_160px_120px_100px_90px] gap-4 px-5 py-4 items-center hover:bg-slate-50 transition-colors"
              >
                {/* Client */}
                <div>
                  <p className="font-medium text-slate-900 text-sm">
                    {appt.client.firstName} {appt.client.lastName}
                  </p>
                  <p className="text-slate-400 text-xs mt-0.5">
                    {appt.durationMinutes} min
                  </p>
                </div>

                {/* Barber */}
                <div className="hidden sm:block text-sm text-slate-700">
                  {appt.barber?.name ?? (
                    <span className="text-slate-400">—</span>
                  )}
                </div>

                {/* Service */}
                <div className="hidden sm:block text-sm text-slate-700">
                  {appt.service?.name ?? (
                    <span className="text-slate-400">—</span>
                  )}
                </div>

                {/* Date */}
                <div className="hidden sm:block text-sm text-slate-600">
                  {formatDate(appt.date)}
                </div>

                {/* Status badge */}
                <div className="hidden sm:block">
                  <span
                    className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_BADGE[appt.status] ?? "bg-slate-100 text-slate-500"}`}
                  >
                    {STATUS_LABEL[appt.status] ?? appt.status}
                  </span>
                </div>

                {/* Tip */}
                <div className="text-right">
                  {appt.tip ? (
                    <p className="text-sm font-medium text-slate-900">
                      {formatCurrency(Number(appt.tip))}
                    </p>
                  ) : (
                    <span className="text-slate-300 text-sm">—</span>
                  )}
                  {/* Mobile: status badge */}
                  <span
                    className={`sm:hidden inline-flex px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${STATUS_BADGE[appt.status] ?? "bg-slate-100 text-slate-500"}`}
                  >
                    {STATUS_LABEL[appt.status] ?? appt.status}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
