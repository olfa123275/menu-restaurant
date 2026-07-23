import Image from 'next/image'
import { supabase } from '@/lib/supabaseClient'

export default async function Home() {
  const { data: categories, error } = await supabase
    .from('categorie')
    .select('id, nom, ordre_affichage, plat(id, nom, description, prix, disponible, image(url))')
    .order('ordre_affichage', { ascending: true })

  if (error) {
    return <div className="p-8 text-red-600">Erreur : {error.message}</div>
  }

  return (
    <main className="max-w-2xl mx-auto px-6 py-12">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-gray-900">Le Bon Plat</h1>
      </header>

      {categories?.map((categorie) => {
        const platsDisponibles = categorie.plat.filter((p) => p.disponible)
        if (platsDisponibles.length === 0) return null

        return (
          <section key={categorie.id} className="mb-10">
            <h2 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-4">
              {categorie.nom}
            </h2>
            <ul className="space-y-5">
              {platsDisponibles.map((plat) => {
                const imageUrl = plat.image?.[0]?.url

                return (
                  <li key={plat.id} className="flex items-start gap-4">
                    {imageUrl && (
                      <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                        <Image
                          src={imageUrl}
                          alt={plat.nom}
                          fill
                         sizes="80px"
                         className="object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 flex justify-between items-start gap-4">
                      <div>
                        <h3 className="font-medium text-gray-900">{plat.nom}</h3>
                        {plat.description && (
                          <p className="text-sm text-gray-500 mt-1">{plat.description}</p>
                        )}
                      </div>
                      <span className="font-semibold text-gray-900 whitespace-nowrap">
                        {plat.prix} €
                      </span>
                    </div>
                  </li>
                )
              })}
            </ul>
          </section>
        )
      })}
    </main>
  )
}