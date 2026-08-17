export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sejong-local-web.vercel.app';

  // List of static paths in the application
  const routes = [
    '',
    '/notice',
    '/sero-day',
    '/sero-members',
    '/sero-ai-start',
    '/mentoring-day',
    '/sero-shop',
    '/sero-talk',
    '/signup',
    '/login',
    '/terms',
    '/privacy',
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString().split('T')[0],
    changeFrequency: 'weekly',
    priority: route === '' ? 1.0 : 0.8,
  }));
}
