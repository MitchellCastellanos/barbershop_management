import { getAppointmentFormData } from "@/actions/appointments";
import { AppointmentForm } from "@/components/appointments/AppointmentForm";
import { createAppointment } from "@/actions/appointments";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

interface PageProps {
  searchParams: Promise<{ clientId?: string }>;
}

export default async function NewAppointmentPage({ searchParams }: PageProps) {
  const { clientId } = await searchParams;
  const formData = await getAppointmentFormData();

  return (
    <div className="max-w-2xl space-y-6">
      {/* Breadcrumb */}
      <div>
        <Link
          href="/appointments"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 mb-2 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Citas
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">Nueva cita</h1>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <AppointmentForm
          {...formData}
          defaultValues={clientId ? { clientId } : undefined}
          onSubmit={createAppointment}
          submitLabel="Crear cita"
        />
      </div>
    </div>
  );
}
