import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';

import PostCard from '@/components/blog/PostCard';
import { getPost, posts } from '@/data/posts';
import { createTranslator, isLocale, locales, localeHref, type Locale } from '@/i18n/config';

export function generateStaticParams() {
  return locales.flatMap((locale) => posts.map((post) => ({ locale, slug: post.slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const l: Locale = isLocale(locale) ? locale : 'sr';
  const post = getPost(slug);
  if (!post) return {};

  return {
    title: post.title[l],
    description: post.excerpt[l],
    openGraph: {
      title: post.title[l],
      description: post.excerpt[l],
      type: 'article',
      images: [{ url: post.image }],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();

  const post = getPost(slug);
  if (!post) notFound();

  const t = createTranslator(locale);
  const related = posts.filter((p) => p.slug !== post.slug);

  return (
    <div className="pt-24">
      <section className="relative overflow-hidden border-b border-[#8A5A2B]/15 bg-linen py-16 md:py-20">
        <div className="container relative z-10">
          <Link
            href={localeHref(locale, '/blog')}
            className="reveal inline-flex items-center gap-2 text-sm font-semibold text-[#8A5A2B]/80 transition-colors hover:text-[#8A5A2B]/70"
          >
            <ArrowLeft className="h-4 w-4" />
            {t('blog.backToBlog')}
          </Link>

          <div className="mt-10 max-w-4xl">
            <span className="reveal stagger-1 eyebrow">{t('blog.eyebrow')}</span>
            <h1 className="reveal stagger-2 mt-5 font-display text-5xl font-semibold leading-[1.02] tracking-[-0.045em] text-[#8A5A2B] md:text-7xl">
              {post.title[locale]}
            </h1>
            <div className="reveal stagger-3 mt-6 flex flex-wrap items-center gap-4 text-sm text-[#8A5A2B]/70">
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-[#8A5A2B]" />
                {t('blog.publishedLabel')} {post.date[locale]}
              </span>
              <span className="h-1 w-1 rounded-full bg-[#F6EEDB]" aria-hidden="true" />
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-[#8A5A2B]" />
                {post.readingTime[locale]}
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="container -mt-8 md:-mt-12">
        <div className="relative mx-auto aspect-[16/9] max-w-5xl overflow-hidden border border-[#8A5A2B]/15 shadow-[0_20px_40px_-15px_rgba(138,90,43,0.18)] md:aspect-[21/9] rounded-[2rem]">
          <Image
            src={post.image}
            alt={post.title[locale]}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 64rem"
            className="object-cover saturate-[0.86]"
          />
        </div>
      </div>

      <section className="section-padding bg-[#FFF7E6]">
        <div className="container">
          <div className="mx-auto max-w-prose">
            {post.body[locale].map((block, index) =>
              block.t === 'h2' ? (
                <h2
                  key={index}
                  className="mb-4 mt-12 font-display text-2xl leading-tight text-[#8A5A2B] first:mt-0"
                >
                  {block.text}
                </h2>
              ) : (
                <p key={index} className="mb-5 text-base leading-relaxed text-[#8A5A2B]/80">
                  {block.text}
                </p>
              )
            )}
          </div>
        </div>
      </section>

      <section className="border-t border-[#8A5A2B]/15 bg-linen py-16 lg:py-20">
        <div className="container">
          <h2 className="mb-8 font-display text-2xl text-[#8A5A2B]">{t('blog.relatedTitle')}</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item, index) => (
              <PostCard
                key={item.slug}
                post={item}
                locale={locale}
                index={index + 1}
                featured={index === 0}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
