import { getServiceById, updateService } from "@/actions/services";
import { ServiceForm } from "@/components/services/ServiceForm";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditServicePage({ params }: Props) {
  const { id } = await params;
  const service = await getServiceById(id);

  async function handleUpdate(data: Parameters<typeof updateService>[1]) {
    "use server";
    return updateService(id, data);
  }

  return (
    <div className="max-w-lg space-y-6">
      <div>
        <Link
          href="/services"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 mb-2 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Servicios
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">Editar servicio</h1>
        <p className="text-slate-500 text-sm mt-1">{service.name}</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <ServiceForm
          onSubmit={handleUpdate}
          submitLabel="Guardar cambios"
          defaultValues={{
            name: service.name,
            description: service.description ?? "",
            durationMinutes: service.durationMinutes,
            price: Number(service.price),
            isActive: service.isActive,
          }}
        />
      </div>
    </div>
  );
}
