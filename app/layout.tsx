import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import '../styles/globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ThemeProvider } from '@/components/theme-provider';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  weight: ['400', '600', '700', '900'],
});

export const metadata: Metadata = {
  title: {
    default: 'Lakbay Region 8 – Discover Eastern Visayas',
    template: '%s – Lakbay Region 8',
  },
  description:
    'Explore 20 curated tourism destinations across Eastern Visayas. Find beaches, heritage sites, nature trails, and adventure spots in Leyte, Samar, and Biliran.',
  openGraph: {
    type: 'website',
    locale: 'en_PH',
    url: 'https://lakbayregion8.com',
    siteName: 'Lakbay Region 8',
    title: 'Lakbay Region 8 – Discover Eastern Visayas',
    description:
      'Explore 20 curated tourism destinations across Eastern Visayas.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lakbay Region 8 – Discover Eastern Visayas',
    description:
      'Explore 20 curated tourism destinations across Eastern Visayas.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://tiles.openfreemap.org" />
        <link
          rel="preconnect"
          href={process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://supabase.co'}
        />
      </head>
      <body className="font-sans antialiased text-[#1a1a1a] dark:text-gray-100">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <main>{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
