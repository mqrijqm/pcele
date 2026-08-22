import { notFound } from 'next/navigation';

import { isLocale } from '@/i18n/config';
import JarShowcase from '@/components/home/JarShowcase';
import Hero from '@/components/home/Hero';
import AboutPreview from '@/components/home/AboutPreview';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import Testimonials from '@/components/home/Testimonials';
import Faq from '@/components/home/Faq';
import Newsletter from '@/components/home/Newsletter';

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <>
      <Hero locale={locale} />
      <JarShowcase />
      <AboutPreview locale={locale} />
      <FeaturedProducts locale={locale} />
      <Testimonials locale={locale} />
      <Faq locale={locale} />
      <Newsletter locale={locale} />
    </>
  );
}
