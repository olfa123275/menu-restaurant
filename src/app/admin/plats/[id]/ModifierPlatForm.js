'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ModifierPlatForm({ plat, categories, imageUrl }) {
  const router = useRouter()
  const [form, setForm] = useState({
    categorie_id: plat.categorie_id,
    nom: plat.nom,
    description: plat.description || '',
    prix: plat.prix,
    disponible: plat.disponible,
  })
  const [file, setFile] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const res = await fetch(`/api/plats/${plat.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, prix: parseFloat(form.prix) }),
    })

    if (!res.ok) {
      setLoading(false)
      const data = await res.json()
      setError(data.error || 'Une erreur est survenue')
      return
    }

    if (file) {
      const imgData = new FormData()
      imgData.append('file', file)
      imgData.append('plat_id', plat.id)

      const imgRes = await fetch('/api/upload-image', { method: 'POST', body: imgData })
      if (!imgRes.ok) {
        setLoading(false)
        setError('Plat modifié, mais erreur lors de l\'envoi de la photo')
        return
      }
    }

    setLoading(false)
    router.push('/admin')
    router.refresh()
  }

  async function handleDelete() {
    if (!confirm('Supprimer ce plat définitivement ?')) return

    setLoading(true)
    const res = await fetch(`/api/plats/${plat.id}`, { method: 'DELETE' })
    setLoading(false)

    if (res.ok) {
      router.push('/admin')
      router.refresh()
    } else {
      setError('Erreur lors de la suppression')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
        <select
          value={form.categorie_id}
          onChange={(e) => setForm({ ...form, categorie_id: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-4 py-2"
        >
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.nom}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nom du plat</label>
        <input
          type="text"
          required
          value={form.nom}
          onChange={(e) => setForm({ ...form, nom: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-4 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-4 py-2"
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Prix (€)</label>
        <input
          type="number"
          step="0.01"
          required
          value={form.prix}
          onChange={(e) => setForm({ ...form, prix: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-4 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Photo du plat</label>
        {imageUrl && (
          <img
            src={imageUrl}
            alt={form.nom}
            className="w-24 h-24 object-cover rounded-lg mb-2"
          />
        )}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
          className="w-full text-sm text-gray-600"
        />
        <p className="text-xs text-gray-400 mt-1">
          Laissez vide pour garder la photo actuelle
        </p>
      </div>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={form.disponible}
          onChange={(e) => setForm({ ...form, disponible: e.target.checked })}
        />
        <span className="text-sm text-gray-700">Disponible</span>
      </label>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-gray-900 text-white rounded-lg py-2 font-medium hover:bg-gray-800 disabled:opacity-50"
        >
          {loading ? 'Enregistrement...' : 'Enregistrer'}
        </button>
        <button
          type="button"
          onClick={handleDelete}
          disabled={loading}
          className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 disabled:opacity-50"
        >
          Supprimer
        </button>
      </div>
    </form>
  )
}