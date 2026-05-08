import { getServices, toggleServiceActive } from "@/actions/services";
import Link from "next/link";
import { Plus, Scissors, Pencil, Clock, DollarSign } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default async function ServicesPage() {
  const services = await getServices(true);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Catálogo de servicios</h1>
          <p className="text-slate-500 text-sm mt-1">
            {services.length} servicio{services.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/services/new"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nuevo servicio
        </Link>
      </div>

      {services.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <Scissors className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-medium">No hay servicios en el catálogo</p>
          <Link
            href="/services/new"
            className="mt-4 inline-flex items-center gap-2 text-blue-600 hover:underline text-sm"
          >
            <Plus className="w-4 h-4" />
            Agregar primer servicio
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="hidden sm:grid grid-cols-[1fr_200px_100px_100px_80px_60px] gap-4 px-5 py-3 bg-slate-50 border-b border-slate-200 text-xs font-medium text-slate-500 uppercase">
            <span>Servicio</span>
            <span>Descripción</span>
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Duración</span>
            <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" /> Precio</span>
            <span>Estado</span>
            <span></span>
          </div>

          <div className="divide-y divide-slate-100">
            {services.map((service) => (
              <div
                key={service.id}
                className="grid grid-cols-[1fr_auto] sm:grid-cols-[1fr_200px_100px_100px_80px_60px] gap-4 px-5 py-4 items-center"
              >
                <div>
                  <p className="font-medium text-slate-900 text-sm">{service.name}</p>
                </div>

                <div className="hidden sm:block text-sm text-slate-500 truncate">
                  {service.description ?? "—"}
                </div>

                <div className="hidden sm:flex items-center gap-1 text-sm text-slate-700">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {service.durationMinutes} min
                </div>

                <div className="hidden sm:block text-sm font-medium text-slate-900">
                  {formatCurrency(Number(service.price))}
                </div>

                <div className="hidden sm:block">
                  <form
                    action={async () => {
                      "use server";
                      await toggleServiceActive(service.id);
                    }}
                  >
                    <button
                      type="submit"
                      className={`text-xs px-2 py-1 rounded-full font-medium transition-colors ${
                        service.isActive
                          ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                          : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                      }`}
                    >
                      {service.isActive ? "Activo" : "Inactivo"}
                    </button>
                  </form>
                </div>

                <div className="flex items-center gap-2 justify-end">
                  <Link
                    href={`/services/${service.id}/edit`}
                    className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
