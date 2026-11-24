import BlogClient, { type Category, type Post, type Tag } from './BlogClient'
import { fetchApi, unwrapList } from '@/lib/serverApi'

export const revalidate = 60

export const metadata = {
  title: 'Blog | Emmanuel Ugbaje — Software Engineering & Platform Insights',
  description:
    'Articles on software engineering, backends, DevOps, cloud, and data from Emmanuel Ugbaje—Python, Django, CI/CD, and scalable systems.',
  keywords: [
    'Infrastructure Engineering',
    'DevOps',
    'Cloud Platforms',
    'Terraform',
    'Kubernetes',
    'CI/CD',
    'AWS',
    'Azure',
    'Scalable Architecture',
  ],
}

export default async function BlogPage() {
  // Rendered on the server so the first paint does not depend on browser CORS.
  const [postsResult, categoriesResult, tagsResult] = await Promise.allSettled([
    fetchApi<unknown>('/blog/posts/'),
    fetchApi<unknown>('/blog/categories/'),
    fetchApi<unknown>('/blog/tags/'),
  ])

  const initialPosts =
    postsResult.status === 'fulfilled' ? unwrapList<Post>(postsResult.value) : null
  const initialCategories =
    categoriesResult.status === 'fulfilled' ? unwrapList<Category>(categoriesResult.value) : null
  const initialTags = tagsResult.status === 'fulfilled' ? unwrapList<Tag>(tagsResult.value) : null

  return (
    <BlogClient
      initialPosts={initialPosts}
      initialCategories={initialCategories}
      initialTags={initialTags}
    />
  )
}
