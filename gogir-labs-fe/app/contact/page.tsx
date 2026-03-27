import ContactClient from './ContactClient'

export const metadata = {
  title: "Let's Chat",
  description:
    'Contact Emmanuel Ugbaje to discuss backend engineering, cloud-native architecture, DevOps, and secure scalable systems.',
  keywords: [
    'contact Emmanuel Ugbaje',
    'backend engineer contact',
    'Django developer',
    'cloud-native solutions',
    'DevOps consulting',
    'secure backend systems',
  ],
}

export default function ContactPage() {
  return <ContactClient />
}
