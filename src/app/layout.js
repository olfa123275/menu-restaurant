import { Fraunces, Manrope } from 'next/font/google'
import './globals.css'

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-display',
})

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
})

export const metadata = {
  title: 'Le Bon Plat',
  description: 'Menu du restaurant',
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className={`${fraunces.variable} ${manrope.variable} font-[family-name:var(--font-body)] bg-cream text-ink relative`}>
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <div
            className="absolute -top-24 -left-24 w-80 h-80 bg-white/60 blur-3xl"
            style={{ borderRadius: '58% 42% 35% 65% / 60% 45% 55% 40%' }}
          />
          <div
            className="absolute top-1/3 -right-28 w-96 h-96 bg-white/50 blur-3xl"
            style={{ borderRadius: '40% 60% 65% 35% / 45% 55% 45% 55%' }}
          />
          <div
            className="absolute bottom-0 left-6 w-72 h-72 bg-white/50 blur-3xl"
            style={{ borderRadius: '50% 50% 35% 65% / 55% 40% 60% 45%' }}
          />
        </div>
        {children}
      </body>
    </html>
  )
}