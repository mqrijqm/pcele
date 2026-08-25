import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-ivory px-6 header-offset text-center">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#73552E]">404</p>
        <h1 className="mt-5 font-display text-5xl font-medium text-[#73552E]">
          Stranica nije pronađena
        </h1>
        <p className="mt-4 text-base text-[#73552E]">
          Stranica koju tražite ne postoji. / The page you are looking for does not exist.
        </p>
        <Link
          href="/sr"
          className="btn mt-8"
        >
          Početna / Home
        </Link>
      </div>
    </div>
  );
}
