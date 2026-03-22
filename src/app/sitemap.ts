import type { MetadataRoute } from 'next'
import { getAllPosts } from '@/lib/blog'

const BASE_URL = 'https://jsonprettify.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/features`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/pricing`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]

  const toolPages: MetadataRoute.Sitemap = [
    'json-formatter',
    'json-validator',
    'json-minifier',
    'json-to-yaml',
    'json-to-csv',
    'json-to-xml',
    'json-diff',
    'json-schema-validator',
    'json-viewer',
  ].map((slug) => ({
    url: `${BASE_URL}/tools/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.9,
  }))

  const blogListPage: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  ]

  let blogPostPages: MetadataRoute.Sitemap = []
  try {
    const posts = getAllPosts()
    blogPostPages = posts.map((post) => ({
      url: `${BASE_URL}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }))
  } catch {
    // If blog posts can't be read, continue without them
  }

  return [...staticPages, ...toolPages, ...blogListPage, ...blogPostPages]
}
