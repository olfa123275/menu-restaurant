import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

function checkAuth(request) {
  const session = request.cookies.get('admin_session')?.value
  return session === process.env.ADMIN_PASSWORD
}

export async function POST(request) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  const formData = await request.formData()
  const file = formData.get('file')
  const platId = formData.get('plat_id')

  if (!file || !platId) {
    return NextResponse.json({ error: 'Fichier ou plat manquant' }, { status: 400 })
  }

  const fileExt = file.name.split('.').pop()
  const filePath = `${platId}-${Date.now()}.${fileExt}`

  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  const { error: uploadError } = await supabaseAdmin.storage
    .from('plats-images')
    .upload(filePath, buffer, { contentType: file.type, upsert: true })

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 400 })
  }

  const { data: publicUrlData } = supabaseAdmin.storage
    .from('plats-images')
    .getPublicUrl(filePath)

  const publicUrl = publicUrlData.publicUrl

  // Supprime l'ancienne image du plat s'il y en avait une, puis ajoute la nouvelle
  await supabaseAdmin.from('image').delete().eq('plat_id', platId)

  const { error: insertError } = await supabaseAdmin.from('image').insert({
    plat_id: platId,
    url: publicUrl,
    storage_path: filePath,
  })

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 400 })
  }

  return NextResponse.json({ url: publicUrl })
}