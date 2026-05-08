"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { serviceSchema, type ServiceFormData } from "@/lib/validations";
import { toast } from "sonner";

interface ServiceFormProps {
  defaultValues?: Partial<ServiceFormData>;
  onSubmit: (data: ServiceFormData) => Promise<{ error?: Record<string, string[]> } | void>;
  submitLabel?: string;
}

export function ServiceForm({ defaultValues, onSubmit, submitLabel = "Guardar" }: ServiceFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: defaultValues?.name ?? "",
      description: defaultValues?.description ?? "",
      durationMinutes: defaultValues?.durationMinutes ?? 30,
      price: defaultValues?.price ?? 0,
      isActive: defaultValues?.isActive ?? true,
    },
  });

  async function onValid(data: ServiceFormData) {
    const result = await onSubmit(data);
    if (result?.error) toast.error("Por favor corrige los errores del formulario");
  }

  return (
    <form onSubmit={handleSubmit(onValid)} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          Nombre del servicio <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          placeholder="Ej: Fade, Corte clásico, Arreglo de barba..."
          {...register("name")}
          className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Descripción</label>
        <textarea
          rows={2}
          placeholder="Breve descripción del servicio..."
          {...register("description")}
          className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Duración (min) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            min={5}
            max={480}
            {...register("durationMinutes", { valueAsNumber: true })}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.durationMinutes && (
            <p className="text-red-500 text-xs mt-1">{errors.durationMinutes.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Precio <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
            <input
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              {...register("price", { valueAsNumber: true })}
              className="w-full border border-slate-300 rounded-lg pl-7 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="isActive"
          {...register("isActive")}
          className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
        />
        <label htmlFor="isActive" className="text-sm text-slate-700">
          Servicio activo (disponible para citas)
        </label>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-medium py-2.5 rounded-lg text-sm transition-colors"
        >
          {isSubmitting ? "Guardando..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
