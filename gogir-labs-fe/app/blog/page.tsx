import BlogClient from './BlogClient'

export const metadata = {
  title: 'Blog | Emmanuel Ugbaje - Infrastructure & DevOps Insights',
  description:
    'Explore insights on infrastructure, DevOps, cloud technologies, and software engineering from Emmanuel Ugbaije. Articles on Terraform, Kubernetes, CI/CD, and scalable cloud platforms.',
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
