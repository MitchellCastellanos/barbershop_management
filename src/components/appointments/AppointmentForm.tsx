"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { appointmentSchema, type AppointmentFormData } from "@/lib/validations";
import { toast } from "sonner";
import { useEffect } from "react";

interface Client {
  id: string;
  firstName: string;
  lastName: string;
}

interface Barber {
  id: string;
  name: string;
}

interface Service {
  id: string;
  name: string;
  durationMinutes: number;
  price: string | number;
}

interface AppointmentFormProps {
  clients: Client[];
  barbers: Barber[];
  services: Service[];
  defaultValues?: Partial<AppointmentFormData>;
  onSubmit: (data: AppointmentFormData) => Promise<{ error?: Record<string, string[]> } | void>;
  submitLabel?: string;
}

const STATUS_OPTIONS = [
  { value: "PENDING", label: "Pendiente" },
  { value: "CONFIRMED", label: "Confirmada" },
  { value: "IN_PROGRESS", label: "En progreso" },
  { value: "COMPLETED", label: "Completada" },
  { value: "CANCELLED", label: "Cancelada" },
];

export function AppointmentForm({
  clients,
  barbers,
  services,
  defaultValues,
  onSubmit,
  submitLabel = "Guardar",
}: AppointmentFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      clientId: defaultValues?.clientId ?? "",
      barberId: defaultValues?.barberId ?? "",
      serviceId: defaultValues?.serviceId ?? "",
      date: defaultValues?.date ?? "",
      durationMinutes: defaultValues?.durationMinutes ?? 30,
      status: defaultValues?.status ?? "PENDING",
      notes: defaultValues?.notes ?? "",
      tip: defaultValues?.tip ?? undefined,
    },
  });

  const watchedServiceId = watch("serviceId");

  useEffect(() => {
    if (watchedServiceId) {
      const svc = services.find((s) => s.id === watchedServiceId);
      if (svc) setValue("durationMinutes", svc.durationMinutes);
    }
  }, [watchedServiceId, services, setValue]);

  async function onValid(data: AppointmentFormData) {
    const result = await onSubmit(data);
    if (result?.error) toast.error("Por favor corrige los errores del formulario");
  }

  const selectedService = services.find((s) => s.id === watchedServiceId);

  return (
    <form onSubmit={handleSubmit(onValid)} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          Cliente <span className="text-red-500">*</span>
        </label>
        <select
          {...register("clientId")}
          className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="">Selecciona un cliente</option>
          {clients.map((c) => (
            <option key={c.id} value={c.id}>
              {c.lastName}, {c.firstName}
            </option>
          ))}
        </select>
        {errors.clientId && (
          <p className="text-red-500 text-xs mt-1">{errors.clientId.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Barbero</label>
        <select
          {...register("barberId")}
          className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="">Sin asignar</option>
          {barbers.map((b) => (
            <option key={b.id} value={b.id}>{b.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Servicio</label>
        <select
          {...register("serviceId")}
          className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="">Sin servicio</option>
          {services.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name} — ${Number(s.price).toFixed(2)} · {s.durationMinutes} min
            </option>
          ))}
        </select>
        {selectedService && (
          <p className="text-xs text-slate-500 mt-1">
            Precio: ${Number(selectedService.price).toFixed(2)} · Duración: {selectedService.durationMinutes} min
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          Fecha y hora <span className="text-red-500">*</span>
        </label>
        <input
          type="datetime-local"
          {...register("date")}
          className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.date && (
          <p className="text-red-500 text-xs mt-1">{errors.date.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Duración (minutos)</label>
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
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Estado</label>
        <select
          {...register("status")}
          className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Propina (opcional)</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
          <input
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            {...register("tip", { valueAsNumber: true })}
            className="w-full border border-slate-300 rounded-lg pl-7 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Notas internas</label>
        <textarea
          rows={3}
          placeholder="Instrucciones especiales, preferencias del cliente..."
          {...register("notes")}
          className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
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
