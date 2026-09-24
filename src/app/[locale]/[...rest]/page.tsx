import { notFound } from 'next/navigation';

/*
 * Hvatač za svaku adresu koju sajt ne poznaje (/sr/nesto-pogresno).
 *
 * Bez njega Next za takve adrese prikaže svoju podrazumijevanu 404 — bijelu,
 * na engleskom, bez zaglavlja i podnožja — jer `[locale]/not-found.tsx` se
 * prikazuje samo kad neka stranica sama pozove `notFound()`. Ova stranica to
 * radi umjesto nepoznate adrese, pa posjetilac vidi našu 404 sa menijem.
 */
export default function NepoznataStranica() {
  notFound();
}
