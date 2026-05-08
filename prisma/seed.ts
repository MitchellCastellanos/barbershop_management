import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL ?? "",
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Iniciando seed...");

  // ── Shop ──────────────────────────────────────────────────
  const shop = await prisma.shop.upsert({
    where: { id: "shop-barbershop-mtl" },
    update: {},
    create: {
      id: "shop-barbershop-mtl",
      name: "Barbería El Estilo MTL",
      address: "1234 Rue Saint-Denis, Montréal, QC H2X 3K1",
      phone: "514-555-0198",
      email: "info@elestilomtl.com",
      taxId: "TPS: 123456789 RT0001 | TVQ: 123456789 TQ0001",
      currency: "CAD",
    },
  });

  // ── Usuario dueño ────────────────────────────────────────
  const passwordHash = await bcrypt.hash("demo123", 12);

  const owner = await prisma.user.upsert({
    where: { email: "demo@barbershop.com" },
    update: {},
    create: {
      shopId: shop.id,
      name: "Carlos Rodríguez",
      email: "demo@barbershop.com",
      passwordHash,
      role: "OWNER",
    },
  });

  // ── Barberos ──────────────────────────────────────────────
  const barber1 = await prisma.user.upsert({
    where: { email: "miguel@barbershop.com" },
    update: {},
    create: {
      shopId: shop.id,
      name: "Miguel Torres",
      email: "miguel@barbershop.com",
      passwordHash,
      role: "BARBER",
    },
  });

  const barber2 = await prisma.user.upsert({
    where: { email: "lucas@barbershop.com" },
    update: {},
    create: {
      shopId: shop.id,
      name: "Lucas Mendoza",
      email: "lucas@barbershop.com",
      passwordHash,
      role: "BARBER",
    },
  });

  console.log(`✅ Shop: ${shop.name}`);
  console.log(`✅ Usuario: ${owner.email} / demo123`);
  console.log(`✅ Barberos: ${barber1.name}, ${barber2.name}`);

  // ── Catálogo de servicios ─────────────────────────────────
  const servicesData = [
    { name: "Corte clásico", description: "Corte tradicional con tijera y/o máquina", durationMinutes: 30, price: 25 },
    { name: "Fade", description: "Degradado moderno a máquina", durationMinutes: 45, price: 30 },
    { name: "Arreglo de barba", description: "Perfilado y arreglo de barba", durationMinutes: 20, price: 15 },
    { name: "Corte + Barba", description: "Corte completo más arreglo de barba", durationMinutes: 60, price: 40 },
    { name: "Afeitado con navaja", description: "Afeitado clásico con navaja y toalla caliente", durationMinutes: 30, price: 20 },
    { name: "Corte infantil", description: "Corte para niños menores de 12 años", durationMinutes: 25, price: 18 },
  ];

  for (const sData of servicesData) {
    await prisma.service.upsert({
      where: { id: `seed-service-${sData.name.toLowerCase().replace(/\s+/g, "-")}` },
      update: {},
      create: {
        id: `seed-service-${sData.name.toLowerCase().replace(/\s+/g, "-")}`,
        shopId: shop.id,
        ...sData,
      },
    });
  }
  console.log(`✅ ${servicesData.length} servicios del catálogo creados`);

  // ── Clientes ──────────────────────────────────────────────
  const clientsData = [
    {
      firstName: "Jean-François",
      lastName: "Tremblay",
      email: "jf.tremblay@gmail.com",
      phone: "514-555-0101",
      address: "456 Rue Sherbrooke O, Montréal, QC",
      hairNotes: "Fade bajo, prefiere degradado suave en los lados",
    },
    {
      firstName: "Marie",
      lastName: "Gagnon",
      email: "marie.gagnon@hotmail.com",
      phone: "514-555-0102",
      hairNotes: "Corte pixie, largo usual: 3cm en parte superior",
    },
    {
      firstName: "Roberto",
      lastName: "Vasquez",
      email: "roberto.v@outlook.com",
      phone: "438-555-0103",
      address: "321 Rue Beaubien, Montréal, QC",
      hairNotes: "Corte + barba cada 3 semanas, barba media",
    },
    {
      firstName: "Sylvie",
      lastName: "Côté",
      email: "sylvie.cote@videotron.ca",
      phone: "450-555-0104",
    },
    {
      firstName: "Ahmed",
      lastName: "Bouazizi",
      email: "a.bouazizi@gmail.com",
      phone: "514-555-0105",
      address: "55 Rue Jean-Talon E, Montréal, QC",
      hairNotes: "Fade alto, línea recta en la frente",
    },
    {
      firstName: "Isabelle",
      lastName: "Lefebvre",
      email: "isabelle.lef@bell.net",
      phone: "514-555-0106",
    },
    {
      firstName: "Pierre-Luc",
      lastName: "Beauchamp",
      email: "pl.beauchamp@gmail.com",
      phone: "438-555-0107",
      address: "88 Blvd. Décarie, Montréal, QC",
      hairNotes: "Corte clásico, nada muy corto en la parte superior",
    },
    {
      firstName: "Nadia",
      lastName: "Morin",
      email: "nadia.morin@yahoo.ca",
      phone: "514-555-0108",
    },
  ];

  let clientCount = 0;
  const createdClients: { id: string }[] = [];

  for (const clientData of clientsData) {
    const client = await prisma.client.upsert({
      where: {
        id: `seed-${clientData.firstName.toLowerCase()}-${clientData.lastName.toLowerCase()}`,
      },
      update: {},
      create: {
        id: `seed-${clientData.firstName.toLowerCase()}-${clientData.lastName.toLowerCase()}`,
        shopId: shop.id,
        ...clientData,
      },
    });
    createdClients.push(client);
    clientCount++;
  }

  console.log(`✅ ${clientCount} clientes creados`);

  // ── Recordatorio de ejemplo ───────────────────────────────
  const firstClient = createdClients[0];
  if (firstClient) {
    await prisma.serviceReminder.upsert({
      where: { id: "seed-reminder-1" },
      update: {},
      create: {
        id: "seed-reminder-1",
        shopId: shop.id,
        clientId: firstClient.id,
        serviceType: "Corte clásico",
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 días
        status: "PENDING",
      },
    });
    console.log("✅ Recordatorio de demo creado");
  }

  console.log("\n🎉 Seed completado exitosamente");
  console.log("   URL: http://localhost:3000");
  console.log("   Usuario: demo@barbershop.com");
  console.log("   Password: demo123");
}

main()
  .catch((e) => {
    console.error("❌ Error en seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
