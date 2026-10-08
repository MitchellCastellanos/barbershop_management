// Template de email para recordatorios de servicio de barbería
// Usa @react-email/components — se renderiza en el servidor con Resend.
// NO es un componente del DOM — solo se usa en email.ts

import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import React from "react";

import { zonedParts } from "@/lib/timezone";
interface ServiceReminderEmailProps {
  clientName: string;
  serviceType: string;
  dueDate?: Date | null;
  shopName: string;
  shopPhone?: string | null;
  shopEmail?: string | null;
}

export function ServiceReminderEmail({
  clientName,
  serviceType,
  dueDate,
  shopName,
  shopPhone,
  shopEmail,
}: ServiceReminderEmailProps) {
  const previewText = `Te esperamos para tu próximo corte en ${shopName}`;

  function fmtDate(date: Date): string {
    const d = zonedParts(date);
    const months = [
      "enero", "febrero", "marzo", "abril", "mayo", "junio",
      "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
    ];
    return `${d.day} de ${months[d.month - 1]} de ${d.year}`;
  }

  return (
    <Html lang="es">
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          {/* Header */}
          <Section style={styles.header}>
            <Heading style={styles.shopName}>{shopName}</Heading>
            <Text style={styles.headerSubtitle}>Recordatorio de cita</Text>
          </Section>

          {/* Greeting */}
          <Section style={styles.content}>
            <Text style={styles.greeting}>Hola {clientName},</Text>
            <Text style={styles.body_text}>
              ha pasado un tiempo desde tu última visita. Te recordamos que es hora de renovar tu estilo. Aquí tienes los detalles:
            </Text>

            {/* Service card */}
            <Section style={styles.card}>
              <Text style={styles.cardLabel}>TIPO DE SERVICIO</Text>
              <Text style={styles.cardValue}>{serviceType}</Text>

              {dueDate && (
                <>
                  <Hr style={styles.cardDivider} />
                  <Text style={styles.cardLabel}>FECHA SUGERIDA</Text>
                  <Text style={styles.cardValue}>{fmtDate(new Date(dueDate))}</Text>
                </>
              )}
            </Section>

            <Text style={styles.body_text}>
              Para agendar tu cita, contáctanos:
            </Text>

            {/* Contact */}
            <Section style={styles.contact}>
              <Text style={styles.contactShop}>{shopName}</Text>
              {shopPhone && (
                <Text style={styles.contactDetail}>📞 {shopPhone}</Text>
              )}
              {shopEmail && (
                <Text style={styles.contactDetail}>✉️ {shopEmail}</Text>
              )}
            </Section>
          </Section>

          {/* Footer */}
          <Section style={styles.footer}>
            <Text style={styles.footerText}>
              Este recordatorio fue enviado automáticamente por {shopName}.
              Si ya realizaste el servicio, puedes ignorar este mensaje.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const styles = {
  body: {
    backgroundColor: "#f1f5f9",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    margin: "0",
    padding: "20px 0",
  },
  container: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    maxWidth: "560px",
    margin: "0 auto",
    overflow: "hidden",
  },
  header: {
    backgroundColor: "#92400e",
    padding: "32px 40px",
  },
  shopName: {
    color: "#ffffff",
    fontSize: "22px",
    fontWeight: "700",
    margin: "0 0 4px 0",
  },
  headerSubtitle: {
    color: "#fde68a",
    fontSize: "13px",
    margin: "0",
  },
  content: {
    padding: "32px 40px",
  },
  greeting: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#0f172a",
    margin: "0 0 4px 0",
  },
  body_text: {
    fontSize: "14px",
    color: "#475569",
    lineHeight: "1.6",
    margin: "0 0 20px 0",
  },
  card: {
    backgroundColor: "#f8fafc",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
    padding: "20px 24px",
    margin: "0 0 24px 0",
  },
  cardLabel: {
    fontSize: "10px",
    fontWeight: "700",
    color: "#94a3b8",
    letterSpacing: "0.8px",
    margin: "0 0 4px 0",
  },
  cardValue: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#0f172a",
    margin: "0",
  },
  cardDivider: {
    borderColor: "#e2e8f0",
    margin: "16px 0",
  },
  contact: {
    backgroundColor: "#fef3c7",
    borderRadius: "8px",
    padding: "16px 20px",
  },
  contactShop: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#92400e",
    margin: "0 0 6px 0",
  },
  contactDetail: {
    fontSize: "13px",
    color: "#475569",
    margin: "2px 0",
  },
  footer: {
    backgroundColor: "#f8fafc",
    borderTop: "1px solid #e2e8f0",
    padding: "20px 40px",
  },
  footerText: {
    fontSize: "11px",
    color: "#94a3b8",
    lineHeight: "1.6",
    margin: "0",
    textAlign: "center" as const,
  },
};
