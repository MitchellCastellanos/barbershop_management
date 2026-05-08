import { createService } from "@/actions/services";
import { ServiceForm } from "@/components/services/ServiceForm";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function NewServicePage() {
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
        <h1 className="text-2xl font-bold text-slate-900">Nuevo servicio</h1>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <ServiceForm onSubmit={createService} submitLabel="Crear servicio" />
      </div>
    </div>
  );
}
