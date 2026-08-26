import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Clock } from 'lucide-react';

import type { Post } from '@/data/posts';
import { createTranslator, localeHref, type Locale } from '@/i18n/config';

export default function PostCard({
  post,
  locale,
  index,
  featured = false,
}: {
  post: Post;
  locale: Locale;
  index: number;
  featured?: boolean;
}) {
  const t = createTranslator(locale);

  return (
    <Link href={localeHref(locale, `/blog/${post.slug}`)} className="group block">
      <article className="transition-transform duration-300 group-hover:-translate-y-1">
        <div
          className={`relative plate overflow-hidden bg-linen ${featured ? 'aspect-[16/8]' : 'aspect-[16/10]'}`}
        >
          <Image
            src={post.image}
            alt={post.title[locale]}
            fill
            sizes={featured ? '(max-width: 1024px) 100vw, 66vw' : '(max-width: 640px) 100vw, 33vw'}
            className="object-cover saturate-[0.88] transition-transform duration-700 group-hover:scale-[1.035]"
          />
          <span className="absolute left-4 top-4 z-10 rounded-full bg-[var(--paper)]/90 px-4 py-2 text-[10px] font-bold tracking-[0.18em] text-[#885B27] backdrop-blur-sm">
            {String(index).padStart(2, '0')}
          </span>
        </div>

        <div className="border-b border-[#885B27]/15 px-1 py-6">
          <div className="flex items-center gap-3 text-xs uppercase tracking-wider text-[#885B27]">
            <span>{post.date[locale]}</span>
            <span className="h-1 w-1 rounded-full bg-[#885B27]/[0.06]" aria-hidden="true" />
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {post.readingTime[locale]}
            </span>
          </div>
          <h3
            className={`mt-3 text-[#885B27] ${
              featured ? 'text-3xl sm:text-4xl' : 'text-2xl'
            }`}
          >
            {post.title[locale]}
          </h3>
          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-[#885B27]">
            {post.excerpt[locale]}
          </p>
          <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[#885B27] transition-colors group-hover:text-[#885B27]">
            {t('blog.readMore')}
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </span>
        </div>
      </article>
    </Link>
  );
}
