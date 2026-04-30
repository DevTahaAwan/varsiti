import { MetadataRoute } from 'next';
import { getCourseList } from "@/lib/courseFetching";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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

  const courseList = await getCourseList();
  const dynamicRoutes = courseList.map((week) => ({
    url: `${baseUrl}/study/${week.weekNumber}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...dynamicRoutes];
}
