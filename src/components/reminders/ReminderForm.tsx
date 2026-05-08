"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { reminderSchema, type ReminderFormData } from "@/lib/validations";

interface Client {
  id: string;
  firstName: string;
  lastName: string;
}

interface ReminderFormProps {
  clients: Client[];
  onSubmit: (data: ReminderFormData) => Promise<{ error?: Record<string, string[]> } | void>;
}

const SERVICE_TYPES = [
  "Corte",
  "Barba",
  "Corte + Barba",
  "Afeitado clásico",
  "Arreglo de cejas",
  "Tratamiento capilar",
  "Otro",
];

export function ReminderForm({ clients, onSubmit }: ReminderFormProps) {
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ReminderFormData>({
    resolver: zodResolver(reminderSchema),
    defaultValues: {
      clientId: "",
      serviceType: "",
      dueDate: "",
      notes: "",
    },
  });

  async function onValid(data: ReminderFormData) {
    startTransition(async () => {
      const result = await onSubmit(data);
      if (result?.error) {
        for (const [field, messages] of Object.entries(result.error)) {
          setError(field as keyof ReminderFormData, { message: messages[0] });
        }
      }
    });
  }

  return (
    <form onSubmit={handleSubmit(onValid)} className="space-y-6 max-w-2xl">

      {/* Cliente */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
        <h2 className="font-semibold text-slate-900">Cliente</h2>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Seleccionar cliente *
          </label>
          <select
            {...register("clientId")}
            className={selectClass(!!errors.clientId)}
          >
            <option value="">Seleccionar cliente...</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.lastName}, {c.firstName}
              </option>
            ))}
          </select>
          {errors.clientId && (
            <p className="text-red-600 text-xs mt-1">{errors.clientId.message}</p>
          )}
        </div>
      </div>

      {/* Servicio */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
        <h2 className="font-semibold text-slate-900">Tipo de servicio</h2>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Servicio *
          </label>
          <select
            {...register("serviceType")}
            className={selectClass(!!errors.serviceType)}
          >
            <option value="">Seleccionar servicio...</option>
            {SERVICE_TYPES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          {errors.serviceType && (
            <p className="text-red-600 text-xs mt-1">{errors.serviceType.message}</p>
          )}
          <p className="text-xs text-slate-400 mt-1">
            Corte, Barba, Corte+Barba, etc.
          </p>
        </div>

        {/* Fecha de vencimiento */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Fecha límite
          </label>
          <input
            {...register("dueDate")}
            type="date"
            className={inputClass(false)}
          />
        </div>
        <p className="text-xs text-slate-400">
          El cron nocturno envía el email cuando la fecha límite esté a ≤7 días.
        </p>
      </div>

      {/* Notas */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          Notas (opcionales)
        </label>
        <textarea
          {...register("notes")}
          rows={3}
          placeholder="Detalles adicionales del servicio..."
          className={inputClass(false)}
        />
      </div>

      {/* Acciones */}
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium px-6 py-2.5 rounded-lg text-sm transition-colors"
        >
          {isPending ? "Guardando..." : "Crear recordatorio"}
        </button>
        <a
          href="/reminders"
          className="text-sm text-slate-500 hover:text-slate-800 transition-colors"
        >
          Cancelar
        </a>
      </div>
    </form>
  );
}

function inputClass(hasError: boolean) {
  return [
    "w-full px-3 py-2 border rounded-lg text-sm",
    "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
    hasError ? "border-red-400 bg-red-50" : "border-slate-300",
  ].join(" ");
}

function selectClass(hasError: boolean) {
  return [
    "w-full px-3 py-2 border rounded-lg text-sm bg-white",
    "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
    hasError ? "border-red-400 bg-red-50" : "border-slate-300",
  ].join(" ");
}
