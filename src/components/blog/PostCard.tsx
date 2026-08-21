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
          className={`relative overflow-hidden bg-linen ${featured ? 'aspect-[16/8]' : 'aspect-[16/10]'} rounded-[2rem]`}
        >
          <Image
            src={post.image}
            alt={post.title[locale]}
            fill
            sizes={featured ? '(max-width: 1024px) 100vw, 66vw' : '(max-width: 640px) 100vw, 33vw'}
            className="object-cover saturate-[0.88] transition-transform duration-700 group-hover:scale-[1.035]"
          />
          <span className="absolute left-4 top-4 z-10 rounded-full bg-[#FFF7E6]/90 px-4 py-2 text-[10px] font-bold tracking-[0.18em] text-[#8A5A2B] backdrop-blur-sm">
            {String(index).padStart(2, '0')}
          </span>
        </div>

        <div className="border-b border-[#8A5A2B]/15 px-1 py-6">
          <div className="flex items-center gap-3 text-xs uppercase tracking-wider text-[#8A5A2B]">
            <span>{post.date[locale]}</span>
            <span className="h-1 w-1 rounded-full bg-[#8A5A2B]/[0.06]" aria-hidden="true" />
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {post.readingTime[locale]}
            </span>
          </div>
          <h3
            className={`mt-3 font-display text-[#8A5A2B] ${
              featured ? 'text-3xl sm:text-4xl' : 'text-2xl'
            }`}
          >
            {post.title[locale]}
          </h3>
          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-[#8A5A2B]">
            {post.excerpt[locale]}
          </p>
          <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[#8A5A2B] transition-colors group-hover:text-[#8A5A2B]">
            {t('blog.readMore')}
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </span>
        </div>
      </article>
    </Link>
  );
}
