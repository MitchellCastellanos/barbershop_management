"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { appointmentSchema, type AppointmentFormData } from "@/lib/validations";

async function getShopId(): Promise<string> {
  const session = await auth();
  if (!session?.user?.shopId) redirect("/login");
  return session.user.shopId;
}

// ── READ ────────────────────────────────────────────────────

export async function getAppointments(status?: string) {
  const shopId = await getShopId();

  return db.appointment.findMany({
    where: {
      shopId,
      ...(status && status !== "ALL" ? { status: status as never } : {}),
    },
    include: {
      client: true,
      barber: true,
      service: true,
    },
    orderBy: { date: "desc" },
  });
}

export async function getAppointmentById(id: string) {
  const shopId = await getShopId();

  const appointment = await db.appointment.findFirst({
    where: { id, shopId },
    include: {
      client: true,
      barber: true,
      service: true,
      invoice: true,
    },
  });

  if (!appointment) redirect("/appointments");
  return appointment;
}

// ── CREATE ──────────────────────────────────────────────────

export async function createAppointment(formData: AppointmentFormData) {
  const shopId = await getShopId();

  const parsed = appointmentSchema.safeParse(formData);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const {
    clientId,
    barberId,
    serviceId,
    date,
    durationMinutes,
    status,
    notes,
    tip,
  } = parsed.data;

  const appointment = await db.appointment.create({
    data: {
      shopId,
      clientId,
      barberId: barberId || null,
      serviceId: serviceId || null,
      date: new Date(date),
      durationMinutes,
      status,
      notes: notes || null,
      tip: tip ?? null,
    },
  });

  revalidatePath("/appointments");
  redirect(`/appointments/${appointment.id}`);
}

// ── UPDATE ──────────────────────────────────────────────────

export async function updateAppointment(
  id: string,
  formData: AppointmentFormData
) {
  const shopId = await getShopId();

  const parsed = appointmentSchema.safeParse(formData);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const {
    clientId,
    barberId,
    serviceId,
    date,
    durationMinutes,
    status,
    notes,
    tip,
  } = parsed.data;

  await db.appointment.updateMany({
    where: { id, shopId },
    data: {
      clientId,
      barberId: barberId || null,
      serviceId: serviceId || null,
      date: new Date(date),
      durationMinutes,
      status,
      notes: notes || null,
      tip: tip ?? null,
    },
  });

  revalidatePath(`/appointments/${id}`);
  revalidatePath("/appointments");
  redirect(`/appointments/${id}`);
}

// ── DELETE ──────────────────────────────────────────────────

export async function deleteAppointment(id: string) {
  const shopId = await getShopId();

  await db.appointment.deleteMany({ where: { id, shopId } });

  revalidatePath("/appointments");
  redirect("/appointments");
}

// ── UPDATE STATUS ────────────────────────────────────────────

export async function updateAppointmentStatus(id: string, status: string) {
  const shopId = await getShopId();

  await db.appointment.updateMany({
    where: { id, shopId },
    data: { status: status as never },
  });

  revalidatePath(`/appointments/${id}`);
  revalidatePath("/appointments");
}

// ── FORM DATA ────────────────────────────────────────────────

export async function getAppointmentFormData() {
  const shopId = await getShopId();

  const [clients, barbers, services] = await Promise.all([
    db.client.findMany({
      where: { shopId },
      orderBy: { lastName: "asc" },
    }),
    db.user.findMany({
      where: {
        shopId,
        role: { in: ["OWNER", "BARBER"] },
      },
      orderBy: { name: "asc" },
    }),
    db.service.findMany({
      where: { shopId, isActive: true },
      orderBy: { name: "asc" },
    }),
  ]);

  return { clients, barbers, services };
}
