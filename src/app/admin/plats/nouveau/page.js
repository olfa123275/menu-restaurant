import { supabase } from '@/lib/supabaseClient'
import NouveauPlatForm from './NouveauPlatForm'

export default async function NouveauPlatPage() {
  const { data: categories } = await supabase
    .from('categorie')
    .select('id, nom')
    .order('ordre_affichage', { ascending: true })

  return (
    <main className="max-w-lg mx-auto px-6 py-12">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Ajouter un plat</h1>
      <NouveauPlatForm categories={categories || []} />
    </main>
  )
}