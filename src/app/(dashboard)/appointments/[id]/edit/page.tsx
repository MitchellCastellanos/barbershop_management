import { getAppointmentById, updateAppointment, getAppointmentFormData } from "@/actions/appointments";
import { AppointmentForm } from "@/components/appointments/AppointmentForm";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditAppointmentPage({ params }: Props) {
  const { id } = await params;
  const [appointment, formData] = await Promise.all([
    getAppointmentById(id),
    getAppointmentFormData(),
  ]);

  async function handleUpdate(data: Parameters<typeof updateAppointment>[1]) {
    "use server";
    return updateAppointment(id, data);
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <Link
          href={`/appointments/${id}`}
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 mb-2 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Cita
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">Editar cita</h1>
        <p className="text-slate-500 text-sm mt-1">
          {appointment.client.firstName} {appointment.client.lastName}
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <AppointmentForm
          {...formData}
          onSubmit={handleUpdate}
          submitLabel="Guardar cambios"
          defaultValues={{
            clientId: appointment.clientId,
            barberId: appointment.barberId ?? "",
            serviceId: appointment.serviceId ?? "",
            date: appointment.date.toISOString().slice(0, 16),
            durationMinutes: appointment.durationMinutes,
            status: appointment.status,
            notes: appointment.notes ?? "",
            tip: appointment.tip ? Number(appointment.tip) : undefined,
          }}
        />
      </div>
    </div>
  );
}
