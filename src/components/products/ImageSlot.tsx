/**
 * Mjesto na kojem ce stajati fotografija.
 *
 * Do tada je prazan sivi blok — namjerno, da se vidi da je polozaj
 * pripremljen a ne da nesto fali. Mjere su prave: odnos stranica,
 * obrezivanje, zaobljenje i ponasanje pri promjeni sirine su isti kakvi
 * ce biti i sa snimkom. Zamjena je onda jedan `<img>` unutra.
 *
 * `slot` ide u `data-image-slot` i po njemu se polozaj nalazi u kodu.
 */
export default function ImageSlot({
  slot,
  label,
  className = '',
}: {
  slot: string;
  label: string;
  className?: string;
}) {
  return (
    <span
      className={`pe-slot ${className}`.trim()}
      data-image-slot={slot}
      role="img"
      aria-label={label}
    />
  );
}
