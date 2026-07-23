import { supabase } from '@/lib/supabaseClient'
import ModifierPlatForm from './ModifierPlatForm'

export default async function ModifierPlatPage({ params }) {
  const { id } = await params

  const { data: plat } = await supabase
    .from('plat')
    .select('id, nom, description, prix, disponible, categorie_id')
    .eq('id', id)
    .single()

  const { data: categories } = await supabase
    .from('categorie')
    .select('id, nom')
    .order('ordre_affichage', { ascending: true })

  const { data: image } = await supabase
    .from('image')
    .select('url')
    .eq('plat_id', id)
    .maybeSingle()

  return (
    <main className="max-w-lg mx-auto px-6 py-12">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Modifier le plat</h1>
      <ModifierPlatForm plat={plat} categories={categories || []} imageUrl={image?.url} />
    </main>
  )
}