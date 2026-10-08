// Zona horaria de la barbería. El servidor (Vercel) corre en UTC, así que
// toda lógica de "día", "mes" o fecha mostrada debe pasar por aquí; de lo
// contrario un servicio a las 6 pm en México (00:00 UTC) cae en el día siguiente.
export const APP_TIMEZONE = "America/Mexico_City";

type Parts = {
  year: number;
  month: number; // 1-12
  day: number;
  hour: number;
  minute: number;
  second: number;
};

const partsFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: APP_TIMEZONE,
  hourCycle: "h23",
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
});

// Componentes de calendario/reloj de una fecha en la zona de la barbería
export function zonedParts(date: Date): Parts {
  const out: Record<string, number> = {};
  for (const p of partsFormatter.formatToParts(date)) {
    if (p.type !== "literal") out[p.type] = Number(p.value);
  }
  return {
    year: out.year,
    month: out.month,
    day: out.day,
    hour: out.hour,
    minute: out.minute,
    second: out.second,
  };
}

// Convierte componentes "de pared" en la zona de la barbería a un instante UTC
export function zonedToDate(
  year: number,
  month: number, // 1-12 (acepta desbordes, p. ej. 0 o 13)
  day: number,
  hour = 0,
  minute = 0,
  second = 0
): Date {
  const asUtc = Date.UTC(year, month - 1, day, hour, minute, second);
  // Offset de la zona en ese instante (ms); se refina una vez por posibles cambios de DST
  let guess = asUtc;
  for (let i = 0; i < 2; i++) {
    const p = zonedParts(new Date(guess));
    const shown = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second);
    guess = asUtc - (shown - guess);
  }
  return new Date(guess);
}

// Parsea "YYYY-MM-DD" o "YYYY-MM-DDTHH:mm" (sin zona) como hora de la barbería.
// Si el string ya trae zona (Z / ±hh:mm) se respeta.
export function parseLocalDateTime(value: string): Date {
  const m = value.match(
    /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2})(?::(\d{2}))?(?:\.\d+)?)?$/
  );
  if (!m) return new Date(value);
  const [, y, mo, d, h = "0", mi = "0", s = "0"] = m;
  return zonedToDate(+y, +mo, +d, +h, +mi, +s);
}

// Valor para <input type="datetime-local"> en la zona de la barbería
export function toLocalInputValue(date: Date): string {
  const p = zonedParts(date);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${p.year}-${pad(p.month)}-${pad(p.day)}T${pad(p.hour)}:${pad(p.minute)}`;
}

export function startOfDay(date: Date = new Date()): Date {
  const p = zonedParts(date);
  return zonedToDate(p.year, p.month, p.day);
}

export function endOfDay(date: Date = new Date()): Date {
  const p = zonedParts(date);
  return new Date(zonedToDate(p.year, p.month, p.day + 1).getTime() - 1);
}

// Primer instante del mes (offset puede ser negativo para meses anteriores)
export function startOfMonth(date: Date = new Date(), monthOffset = 0): Date {
  const p = zonedParts(date);
  return zonedToDate(p.year, p.month + monthOffset, 1);
}
