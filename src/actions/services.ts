"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { serviceSchema, type ServiceFormData } from "@/lib/validations";

async function getShopId(): Promise<string> {
  const session = await auth();
  if (!session?.user?.shopId) redirect("/login");
  return session.user.shopId;
}

// ── READ ────────────────────────────────────────────────────

export async function getServices(includeInactive = false) {
  const shopId = await getShopId();

  return db.service.findMany({
    where: {
      shopId,
      ...(includeInactive ? {} : { isActive: true }),
    },
    orderBy: { name: "asc" },
  });
}

export async function getServiceById(id: string) {
  const shopId = await getShopId();

  const service = await db.service.findFirst({
    where: { id, shopId },
  });

  if (!service) redirect("/services");
  return service;
}

// ── CREATE ──────────────────────────────────────────────────

export async function createService(formData: ServiceFormData) {
  const shopId = await getShopId();

  const parsed = serviceSchema.safeParse(formData);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const { name, description, durationMinutes, price, isActive } = parsed.data;

  const service = await db.service.create({
    data: {
      shopId,
      name,
      description: description || null,
      durationMinutes,
      price: price.toString(),
      isActive,
    },
  });

  revalidatePath("/services");
  redirect(`/services`);
}

// ── UPDATE ──────────────────────────────────────────────────

export async function updateService(id: string, formData: ServiceFormData) {
  const shopId = await getShopId();

  const parsed = serviceSchema.safeParse(formData);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const { name, description, durationMinutes, price, isActive } = parsed.data;

  await db.service.updateMany({
    where: { id, shopId },
    data: {
      name,
      description: description || null,
      durationMinutes,
      price: price.toString(),
      isActive,
    },
  });

  revalidatePath("/services");
  redirect("/services");
}

// ── TOGGLE ACTIVE ────────────────────────────────────────────

export async function toggleServiceActive(id: string) {
  const shopId = await getShopId();

  const service = await db.service.findFirst({ where: { id, shopId } });
  if (!service) return;

  await db.service.updateMany({
    where: { id, shopId },
    data: { isActive: !service.isActive },
  });

  revalidatePath("/services");
}
