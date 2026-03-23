import BlogClient from './BlogClient'

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

export default function BlogPage() {
  return <BlogClient />
}
