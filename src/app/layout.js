import { Playfair_Display, Jost } from 'next/font/google'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['600', '700'],
  style: ['italic', 'normal'],
  variable: '--font-display',
})

const jost = Jost({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-body',
})

export const metadata = {
  title: 'Le Bon Plat',
  description: 'Menu du restaurant',
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className={`${playfair.variable} ${jost.variable} font-[family-name:var(--font-body)] text-cream-100`}>
        {children}
      </body>
    </html>
  )
}