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
      <header className="pt-10 pb-6 px-6 text-center">
        <h1 className="font-[family-name:var(--font-display)] font-semibold text-3xl text-ink">
          Le Bon Plat
        </h1>
        <div className="w-10 h-0.5 bg-clay-600 mx-auto mt-3 rounded-full" />
      </header>

      <MenuGrid categories={visibleCategories} />
    </main>
  )
}