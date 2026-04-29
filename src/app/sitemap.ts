import { MetadataRoute } from 'next';
import { course } from '@/lib/courseData';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://varsiti.xyz';

  const staticRoutes = [
    '',
    '/about',
    '/study',
    '/practice',
    '/sign-in',
    '/sign-up',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  const dynamicRoutes = Object.keys(course).map((week) => ({
    url: `${baseUrl}/study/${week}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...dynamicRoutes];
}
