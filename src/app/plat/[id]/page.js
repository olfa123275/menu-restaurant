import Image from 'next/image'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'

export default async function PlatDetail({ params }) {
  const { id } = await params

  const { data: plat } = await supabase
    .from('plat')
    .select('id, nom, description, prix, disponible, categorie(nom), image(url)')
    .eq('id', id)
    .single()

  if (!plat) {
    return (
      <main className="min-h-screen bg-cream flex items-center justify-center">
        <p className="text-ink">Plat introuvable.</p>
      </main>
    )
  }

  const imageUrl = plat.image?.[0]?.url

  return (
    <main className="min-h-screen bg-cream pb-16">
      <div className="relative w-full aspect-square bg-clay-100">
        {imageUrl && (
          <Image src={imageUrl} alt={plat.nom} fill sizes="600px" className="object-cover" />
        )}
        <Link
          href="/"
          className="absolute top-4 left-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/90 text-ink shadow-sm"
          aria-label="Retour au menu"
        >
          ←
        </Link>
      </div>

      <div className="px-6 pt-6">
        <p className="text-sm text-muted mb-1">{plat.categorie?.nom}</p>
        <div className="flex items-start justify-between gap-4 mb-4">
          <h1 className="font-[family-name:var(--font-display)] font-semibold text-2xl text-ink">
            {plat.nom}
          </h1>
          <span className="bg-clay-600 text-cream font-semibold px-3 py-1.5 rounded-full whitespace-nowrap">
            {Number(plat.prix).toFixed(2)} €
          </span>
        </div>
        {plat.description && <p className="text-muted leading-relaxed">{plat.description}</p>}
        {!plat.disponible && (
          <p className="mt-4 text-sm text-clay-600 font-medium">Actuellement indisponible</p>
        )}
      </div>
    </main>
  )
}