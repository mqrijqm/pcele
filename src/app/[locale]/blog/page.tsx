import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight } from 'lucide-react';

import PostCard from '@/components/blog/PostCard';
import { blogPage, meta } from '@/content/pages';
import { posts } from '@/data/posts';
import { isLocale, localeHref, type Locale } from '@/i18n/config';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const l: Locale = isLocale(locale) ? locale : 'sr';
  return { title: meta[l].blog.title, description: meta[l].blog.description };
}

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const copy = blogPage[locale];
  const ordered = [...posts].sort((a, b) => a.order - b.order);

  /*
   * Strana se cita u tri poteza:
   *   mozaik   — pet zapisa kao slike, jedna velika i cetiri manje
   *   izdvojen — jedan zapis razvucen preko dvije kolone, sa dvije slike
   *   ostatak  — sve sto nije stalo gore
   */
  const mosaic = ordered.slice(0, 5);
  const feature = ordered[5] ?? ordered[0];
  const rest = ordered.slice(6);

  const readLabel = locale === 'sr' ? 'Pročitaj zapis' : 'Read the piece';
  const allLabel = locale === 'sr' ? 'Svi zapisi' : 'All pieces';
  const restLabel = locale === 'sr' ? 'Još iz pčelinjaka' : 'More from the apiary';

  return (
    <div className="bg-[var(--paper)] header-offset">
      {/* --- uvod ------------------------------------------------------- */}
      <section className="section-padding-sm">
        <div className="container">
          <p className="blog-intro__eyebrow reveal">{copy.eyebrow}</p>
          <h1 className="blog-intro__heading reveal stagger-1">{copy.heading}</h1>
          <p className="blog-intro__lead reveal stagger-2">{copy.description}</p>
        </div>
      </section>

      {/* --- mozaik ----------------------------------------------------- */}
      <section className="pb-[var(--section-padding-sm)]">
        <div className="container-wide">
          <div className="blog-mosaic">
            {mosaic.map((post, i) => (
              <Link
                key={post.slug}
                href={localeHref(locale, `/blog/${post.slug}`)}
                className={`blog-mosaic__tile reveal stagger-${i + 1}`}
              >
                <Image
                  src={post.image}
                  alt=""
                  fill
                  sizes={i === 0 ? '(max-width: 900px) 100vw, 48vw' : '(max-width: 900px) 50vw, 24vw'}
                  className="object-cover"
                />
                <span className="blog-mosaic__label">{post.title[locale]}</span>
              </Link>
            ))}
          </div>

          <div className="mt-6 flex justify-end">
            <Link href={localeHref(locale, '/blog')} className="blog-cta blog-cta--solid">
              {allLabel}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* --- izdvojen zapis --------------------------------------------- */}
      <section className="section-padding-sm">
        <div className="container">
          <div className="blog-feature">
            <h2 className="blog-feature__title reveal">{feature.title[locale]}</h2>

            <div className="blog-feature__shot blog-feature__shot--main reveal stagger-1">
              <Image
                src={feature.image}
                alt=""
                fill
                sizes="(max-width: 1024px) 100vw, 42vw"
                className="object-cover"
              />
            </div>

            <div className="blog-feature__shot blog-feature__shot--inset reveal stagger-3">
              <Image
                src="/images/real/pcele-cvijet.webp"
                alt=""
                fill
                sizes="(max-width: 1024px) 40vw, 18vw"
                className="object-cover"
              />
            </div>

            <p className="blog-feature__lede reveal stagger-2">{feature.excerpt[locale]}</p>

            <div className="blog-feature__aside reveal stagger-3">
              <p>{feature.body[locale].find((b) => b.t === 'p')?.text}</p>
              <Link
                href={localeHref(locale, `/blog/${feature.slug}`)}
                className="blog-cta blog-cta--outline mt-8"
              >
                {readLabel}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* --- ostatak ----------------------------------------------------- */}
      {rest.length > 0 && (
        <section className="section-padding-sm">
          <div className="container">
            <p className="blog-intro__eyebrow mb-10">{restLabel}</p>
            <div className="grid gap-x-7 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-9">
              {rest.map((post, index) => (
                <div key={post.slug} className={`reveal stagger-${index + 1}`}>
                  <PostCard post={post} locale={locale} index={index + 1} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
