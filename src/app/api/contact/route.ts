import { NextResponse } from 'next/server';

import { validateContact, type ContactValues } from '@/lib/contact';

/*
 * Kontakt forma -> mejl.
 *
 * Šalje kroz Resend (servis za slanje mejlova, besplatan plan je dovoljan).
 * Radi tek kad su u Vercel Environment Variables upisani:
 *
 *   RESEND_API_KEY  — ključ sa resend.com (obavezno)
 *   CONTACT_TO      — kome stiže upit (podrazumijevano pcelarstvojevtic@gmail.com)
 *   CONTACT_FROM    — pošiljalac, npr. "Pčelarstvo Jevtić <upit@tvojdomen.ba>"
 *                     (podrazumijevano onboarding@resend.dev, koji Resend
 *                     dozvoljava samo za slanje na mejl vlasnika naloga)
 *
 * Dok ključa nema, ruta odgovara 503 "not-configured", a forma na stranici
 * tada pada nazad na mailto — pa kontakt radi i prije nego što se ovo podesi.
 *
 * Zaštita od spama, po redu: (1) skriveno polje koje čovjek ne vidi a bot
 * popuni, (2) prekratko vrijeme popunjavanja, (3) ograničenje po IP adresi.
 * Botu koji padne na (1) ili (2) vraćamo "uspjeh" — da ne uči šta ga je odao.
 */

export const dynamic = 'force-dynamic';

const DEFAULT_TO = 'pcelarstvojevtic@gmail.com';
const DEFAULT_FROM = 'Pčelarstvo Jevtić <onboarding@resend.dev>';

const MIN_FILL_MS = 1500;
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;

/*
 * Brojač po IP adresi živi u memoriji jedne instance. Na Vercelu ih može biti
 * više, pa je ovo grubo sito, ne brava — ali dovoljno da zaustavi nekoga ko
 * u petlji zasipa formu.
 */
const hits = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);

  if (hits.size > 500) {
    for (const [key, times] of hits) {
      if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(key);
    }
  }
  return recent.length > MAX_PER_WINDOW;
}

/** Sve što ide u naslov mejla mora biti u jednom redu (bez ubacivanja zaglavlja). */
const oneLine = (s: string) => s.replace(/[\r\n\t]+/g, ' ').trim();

export async function POST(request: Request) {
  const raw: unknown = await request.json().catch(() => null);
  if (!raw || typeof raw !== 'object') {
    return NextResponse.json({ ok: false, reason: 'invalid' }, { status: 400 });
  }
  const body = raw as Record<string, unknown>;
  const text = (key: string) => (typeof body[key] === 'string' ? (body[key] as string) : '');

  // (1) i (2): bot — tiho "uspjeh", ništa se ne šalje.
  const elapsed = typeof body.elapsedMs === 'number' ? body.elapsedMs : 0;
  if (text('hp_company') !== '' || elapsed < MIN_FILL_MS) {
    return NextResponse.json({ ok: true });
  }

  // (3)
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  if (isRateLimited(ip)) {
    return NextResponse.json({ ok: false, reason: 'rate-limited' }, { status: 429 });
  }

  const values: ContactValues = {
    firstName: text('firstName'),
    lastName: text('lastName'),
    email: text('email'),
    phone: text('phone'),
    interest: text('interest'),
    message: text('message'),
    consent: body.consent === true,
  };

  const errors = validateContact(values);
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ ok: false, reason: 'invalid', errors }, { status: 422 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ ok: false, reason: 'not-configured' }, { status: 503 });
  }

  const firstName = oneLine(values.firstName);
  const lastName = oneLine(values.lastName);

  // Samo običan tekst, bez HTML-a — nema šta da se ubaci u mejl.
  const mailText = [
    'Novi upit sa sajta',
    '',
    `Ime: ${firstName}`,
    `Prezime: ${lastName}`,
    `Email: ${oneLine(values.email)}`,
    `Telefon: ${oneLine(values.phone) || '—'}`,
    `Interesovanje: ${oneLine(values.interest)}`,
    '',
    'Poruka:',
    values.message.trim() || '(bez poruke)',
  ].join('\n');

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM || DEFAULT_FROM,
        to: [process.env.CONTACT_TO || DEFAULT_TO],
        reply_to: oneLine(values.email),
        subject: `Upit sa sajta — ${firstName} ${lastName}`,
        text: mailText,
      }),
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) {
      console.error('[contact] Resend odbio zahtjev:', res.status, await res.text());
      return NextResponse.json({ ok: false, reason: 'send-failed' }, { status: 502 });
    }
  } catch (err) {
    console.error('[contact] slanje nije uspjelo:', err);
    return NextResponse.json({ ok: false, reason: 'send-failed' }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
