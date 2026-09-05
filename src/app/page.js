import Image from 'next/image'
import { supabase } from '@/lib/supabaseClient'
import MenuGrid from './MenuGrid'

export default async function Home() {
  const { data: categories, error } = await supabase
    .from('categorie')
    .select('id, nom, ordre_affichage, plat(id, nom, description, prix, disponible, image(url))')
    .order('ordre_affichage', { ascending: true })

  if (error) {
    return <div className="p-8 text-red-600">Erreur : {error.message}</div>
  }

  const visibleCategories = (categories || [])
    .map((cat) => ({ ...cat, plat: cat.plat.filter((p) => p.disponible) }))
    .filter((cat) => cat.plat.length > 0)

  return (
    <main className="min-h-screen bg-cream pb-16">
      <header className="relative w-full h-72 overflow-hidden">
        <Image
          src="/hero.jpg"
          alt="D'Brunch"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-ink/40 to-ink/90" />
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-6 text-center">
          <h1 className="font-[family-name:var(--font-display)] font-semibold text-5xl text-cream drop-shadow-md">
            D'Brunch
          </h1>
          <div className="w-10 h-0.5 bg-saffron-500 mx-auto mt-3 rounded-full" />
        </div>
      </header>

      <MenuGrid categories={visibleCategories} />
    </main>
  )
}