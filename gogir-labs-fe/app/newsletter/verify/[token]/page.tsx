import { notFound } from 'next/navigation'
import NewsletterVerifyClient from './NewsletterVerifyClient'

export const dynamic = 'force-dynamic'

interface NewsletterVerifyPageProps {
  params: Promise<{ token?: string }>
}

export default async function NewsletterVerifyPage({ params }: NewsletterVerifyPageProps) {
  const { token } = await params
  if (!token) notFound()

  return <NewsletterVerifyClient token={token} />
}
