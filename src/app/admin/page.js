import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'

export default async function AdminHome() {
  const { data: plats, error } = await supabase
    .from('plat')
    .select('id, nom, prix, disponible, categorie(nom)')
    .order('nom', { ascending: true })

  if (error) {
    return <div className="p-8 text-red-600">Erreur : {error.message}</div>
  }

  return (
    <main className="max-w-2xl mx-auto px-6 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
        <div className="flex gap-3">
  <Link
    href="/admin/qrcode"
    className="border border-gray-300 text-gray-700 rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-50"
  >
    QR code
  </Link>
  <Link
    href="/admin/plats/nouveau"
    className="bg-gray-900 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-800"
  >
    + Ajouter un plat
  </Link>
</div>
      </div>

      <ul className="divide-y divide-gray-200">
        {plats?.map((plat) => (
          <li key={plat.id} className="py-4 flex justify-between items-center">
            <div>
              <p className="font-medium text-gray-900">{plat.nom}</p>
              <p className="text-sm text-gray-500">
                {plat.categorie?.nom} · {plat.disponible ? 'Disponible' : 'Indisponible'}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-semibold text-gray-900">{plat.prix} €</span>
              <Link
                href={`/admin/plats/${plat.id}`}
                className="text-sm text-blue-600 hover:underline"
              >
                Modifier
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </main>
  )
}