import './globals.css'
import { Inter } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from '@/components/AuthProvider'
import { QueryProvider } from '@/components/QueryProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'TalentMatch AI - Free Premium Job Matching Platform | ATS Resume Templates | Instant Apply',
  description: 'AI-powered job matching platform with FREE premium features. Professional ATS resume templates, instant job applications, perfect job matching. No subscription required - all features completely free!',
  keywords: 'job matching, resume templates, ATS friendly, instant apply, job search, career platform, free job tools, professional resume, AI job matching',
  author: 'TalentMatch AI',
  openGraph: {
    title: 'TalentMatch AI - Free Premium Job Matching Platform',
    description: 'Get all premium job search features completely FREE! Professional ATS resume templates, instant applications, and AI-powered job matching.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TalentMatch AI - Free Premium Job Matching',
    description: 'Professional job search tools completely FREE! ATS templates, instant apply, AI matching.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryProvider>
          <AuthProvider>
            {children}
            <Toaster position="top-right" />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
