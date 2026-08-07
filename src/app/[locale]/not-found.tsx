import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-ivory px-6 pt-24 text-center">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#82601f]">404</p>
        <h1 className="mt-5 font-display text-5xl font-medium text-espresso">
          Stranica nije pronađena
        </h1>
        <p className="mt-4 text-base text-walnut">
          Stranica koju tražite ne postoji. / The page you are looking for does not exist.
        </p>
        <Link
          href="/sr"
          className="mt-8 inline-flex min-h-12 items-center rounded-full bg-honey px-7 text-sm font-semibold text-white transition-colors hover:bg-honey-600"
        >
          Početna / Home
        </Link>
      </div>
    </div>
  );
}
