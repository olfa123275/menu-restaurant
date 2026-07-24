import Image from 'next/image'
import { supabase } from '@/lib/supabaseClient'

export default async function Home() {
  const { data: categories, error } = await supabase
    .from('categorie')
    .select('id, nom, ordre_affichage, plat(id, nom, description, prix, disponible, image(url))')
    .order('ordre_affichage', { ascending: true })

  if (error) {
    return <div className="p-8 text-red-400">Erreur : {error.message}</div>
  }

  const visibleCategories = (categories || [])
    .map((cat) => ({ ...cat, plat: cat.plat.filter((p) => p.disponible) }))
    .filter((cat) => cat.plat.length > 0)

  const featuredImage = visibleCategories
    .flatMap((c) => c.plat)
    .find((p) => p.image?.[0]?.url)?.image[0]?.url

  const rays = Array.from({ length: 28 })

  return (
    <main className="min-h-screen bg-wine-950 pb-16">
      <header className="pt-14 pb-10 px-6 text-center">
        <div className="relative w-36 h-36 mx-auto mb-6">
          <svg viewBox="0 0 160 160" className="absolute inset-0 w-full h-full">
            {rays.map((_, i) => {
              const angle = (360 / rays.length) * i
              return (
                <line
                  key={i}
                  x1="80" y1="4" x2="80" y2="16"
                  stroke="#D8AE62"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  opacity={i % 2 === 0 ? 0.9 : 0.35}
                  transform={`rotate(${angle} 80 80)`}
                />
              )
            })}
          </svg>
          {featuredImage && (
            <div className="absolute inset-[16px] rounded-full overflow-hidden ring-2 ring-gold-400">
              <Image src={featuredImage} alt="" fill sizes="144px" className="object-cover" />
            </div>
          )}
        </div>

        <h1 className="font-[family-name:var(--font-display)] italic text-4xl text-cream-100 mb-3">
          Le Bon Plat
        </h1>
        <div className="w-16 h-px bg-gold-400 mx-auto" />
      </header>

      <div className="max-w-md mx-auto px-6 space-y-12">
        {visibleCategories.map((categorie) => {
          const thumb = categorie.plat.find((p) => p.image?.[0]?.url)?.image[0]?.url

          return (
            <section key={categorie.id}>
              <div className="flex items-center gap-3 mb-5">
                <span className="flex-1 h-px bg-gold-400/40" />
                <h2 className="font-[family-name:var(--font-display)] italic text-xl text-gold-400 tracking-wide whitespace-nowrap flex items-center gap-3">
                  {thumb && (
                    <span className="relative w-9 h-9 rounded-full overflow-hidden ring-1 ring-gold-400 inline-block">
                      <Image src={thumb} alt="" fill sizes="36px" className="object-cover" />
                    </span>
                  )}
                  {categorie.nom}
                </h2>
                <span className="flex-1 h-px bg-gold-400/40" />
              </div>

              <ul className="space-y-5">
  {categorie.plat.map((plat) => {
    const platImage = plat.image?.[0]?.url

    return (
      <li key={plat.id} className="flex gap-3">
        {platImage && (
          <span className="relative w-14 h-14 rounded-full overflow-hidden ring-1 ring-gold-400/60 flex-shrink-0">
            <Image src={platImage} alt="" fill sizes="56px" className="object-cover" />
          </span>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-end gap-2">
            <span className="text-cream-100 font-medium">{plat.nom}</span>
            <span className="flex-1 border-b border-dotted border-cream-400/40 mb-1" />
            <span className="text-gold-200 font-semibold whitespace-nowrap">
              {Number(plat.prix).toFixed(2)} €
            </span>
          </div>
          {plat.description && (
            <p className="text-sm text-cream-400 mt-1">{plat.description}</p>
          )}
        </div>
      </li>
    )
  })}
</ul>
            </section>
          )
        })}
      </div>
    </main>
  )
}