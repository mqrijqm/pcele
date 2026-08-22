import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import PageHero from '@/components/ui/PageHero';
import PostCard from '@/components/blog/PostCard';
import ImageBreak from '@/components/ui/ImageBreak';
import { blogPage, meta, photoBreaks } from '@/content/pages';
import { posts } from '@/data/posts';
import { isLocale, type Locale } from '@/i18n/config';

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
  const shot = photoBreaks[locale];

  return (
    <div className="bg-ivory">
      <PageHero
        eyebrow={copy.eyebrow}
        heading={copy.heading}
        description={copy.description}
        note={copy.note}
        image="/images/real/kosnice-livada.webp"
        imageAlt={copy.heroAlt}
        background="#FDF9DC"
        cardSide="right"
        imageWidth="lg:w-[78%]"
        cardWidth="lg:w-[42%]"
      />

      <section className="bg-ivory section-padding">
        <div className="container">
          <div className="grid gap-x-7 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-9">
            {ordered.map((post, index) => (
              <div
                key={post.slug}
                className={`reveal stagger-${index + 1} ${
                  index === 0 ? 'sm:col-span-2 lg:col-span-2' : ''
                }`}
              >
                <PostCard post={post} locale={locale} index={index + 1} featured={index === 0} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <ImageBreak
        variant="pair"
        images={[
          { src: '/images/mockups/jar-meadow-dandelions.webp', alt: shot.blogSeasons.altMeadow },
          { src: '/images/mockups/jars-sunset-tree.webp', alt: shot.blogSeasons.altSunset },
        ]}
        caption={shot.blogSeasons.caption}
        meta={shot.blogSeasons.meta}
        background="#73552E0F"
      />
    </div>
  );
}
