import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/login'],
    },
    sitemap: 'https://api.gogirlabs.uk/sitemap.xml',
    host: 'https://www.gogirlabs.uk',
  }
}
