'use client'

import { useEffect, useRef, useState } from 'react'
import QRCode from 'qrcode'

export default function QrCodePage() {
  const canvasRef = useRef(null)
  const [menuUrl, setMenuUrl] = useState('')

  useEffect(() => {
    const url = window.location.origin
    setMenuUrl(url)

    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, url, {
        width: 320,
        margin: 2,
        color: { dark: '#111827', light: '#ffffff' },
      })
    }
  }, [])

  function handleDownload() {
    const canvas = canvasRef.current
    const link = document.createElement('a')
    link.download = 'qrcode-menu.png'
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  return (
    <main className="max-w-md mx-auto px-6 py-12 text-center">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">QR code du menu</h1>
      <p className="text-sm text-gray-500 mb-6 break-all">{menuUrl}</p>

      <div className="flex justify-center mb-6">
        <canvas ref={canvasRef} className="border border-gray-200 rounded-lg" />
      </div>

      <button
        onClick={handleDownload}
        className="bg-gray-900 text-white rounded-lg px-6 py-2 font-medium hover:bg-gray-800"
      >
        Télécharger en PNG
      </button>

      <p className="text-xs text-gray-400 mt-4">
        Imprimez ce QR code et placez-le sur vos tables.
      </p>
    </main>
  )
}