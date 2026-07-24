'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function MenuGrid({ categories }) {
  const [active, setActive] = useState('Tous')

  const tabs = ['Tous', ...categories.map((c) => c.nom)]
  const plats = categories.flatMap((c) => c.plat.map((p) => ({ ...p, categorieNom: c.nom })))
  const filtered = active === 'Tous' ? plats : plats.filter((p) => p.categorieNom === active)

  return (
    <div className="px-5">
      <div className="flex gap-2 overflow-x-auto pb-4 mb-5 -mx-5 px-5 scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              active === tab ? 'bg-clay-600 text-cream' : 'bg-clay-100 text-ink'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-x-5 gap-y-8">
        {filtered.map((plat) => {
          const imageUrl = plat.image?.[0]?.url
          return (
            <Link
              key={plat.id}
              href={`/plat/${plat.id}`}
              className="bg-white rounded-2xl overflow-hidden shadow-sm"
            >
              <div className="relative w-full aspect-square bg-clay-100">
                {imageUrl && (
                  <Image src={imageUrl} alt={plat.nom} fill sizes="200px" className="object-cover" />
                )}
                <span className="absolute bottom-2 right-2 bg-clay-600 text-cream text-xs font-semibold px-2.5 py-1 rounded-full">
                  {Number(plat.prix).toFixed(2)} €
                </span>
              </div>
              <div className="p-3">
                <p className="text-xs text-muted mb-0.5">{plat.categorieNom}</p>
                <h3 className="font-[family-name:var(--font-display)] font-medium text-ink leading-snug">
                  {plat.nom}
                </h3>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}