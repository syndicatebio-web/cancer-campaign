export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-server'

const REPLICATE_API_URL = 'https://api.replicate.com/v1/predictions'
const DEFAULT_BUCKET = 'syndicate-files'

// Single, clear prompt – we no longer use filterType
const PROMPT =
  'transform this image to a slightly comic military character, but let it still look like the original image'

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { imageBase64 } = body

    if (!imageBase64) {
      return NextResponse.json(
        { error: 'imageBase64 is required' },
        { status: 400 }
      )
    }

    const token = process.env.REPLICATE_API_TOKEN
    const version = process.env.REPLICATE_MODEL_VERSION

    if (!token || !version) {
      return NextResponse.json(
        {
          error:
            'REPLICATE_API_TOKEN and REPLICATE_MODEL_VERSION must be configured on the server',
        },
        { status: 500 }
      )
    }

    // Clean base64 string (remove data URL prefix if present)
    const base64Image = imageBase64.includes(',')
      ? imageBase64.split(',')[1]
      : imageBase64

    // 1. Create prediction for google/nano-banana (Gemini image model on Replicate)
    const createRes = await fetch(REPLICATE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify({
        version,
        input: {
          // Model expects this exact input shape:
          // prompt: string
          // image_input: array of image URLs or data URIs
          // aspect_ratio: e.g. 'match_input_image'
          // output_format: e.g. 'jpg'
          prompt: PROMPT,
          image_input: [`data:image/png;base64,${base64Image}`],
          aspect_ratio: 'match_input_image',
          output_format: 'jpg',
        },
      }),
    })

    if (!createRes.ok) {
      const errorBody = await createRes.text().catch(() => null)
      console.error(
        'Replicate create prediction error:',
        createRes.status,
        createRes.statusText,
        errorBody
      )
      return NextResponse.json(
        { error: 'Failed to start image transformation with Replicate' },
        { status: 500 }
      )
    }

    let prediction = await createRes.json()
    console.log('[Replicate] Create prediction response:', JSON.stringify(prediction, null, 2))

    // 2. Poll prediction until it completes or fails
    const getUrl: string | undefined = prediction.urls?.get
    if (!getUrl) {
      console.error('Replicate prediction has no get URL', prediction)
      return NextResponse.json(
        { error: 'Replicate prediction did not return a status URL' },
        { status: 500 }
      )
    }

    let attempts = 0
    const maxAttempts = 20

    while (
      prediction.status === 'starting' ||
      prediction.status === 'processing'
    ) {
      if (attempts >= maxAttempts) {
        console.error('Replicate prediction polling timed out', prediction)
        return NextResponse.json(
          { error: 'Image transformation timed out. Please try again.' },
          { status: 504 }
        )
      }

      await sleep(1500)
      attempts += 1

      const pollRes = await fetch(getUrl, {
        headers: {
          Authorization: `Token ${token}`,
        },
      })

      if (!pollRes.ok) {
        const errorBody = await pollRes.text().catch(() => null)
        console.error(
          'Replicate poll prediction error:',
          pollRes.status,
          pollRes.statusText,
          errorBody
        )
        return NextResponse.json(
          { error: 'Failed while checking Replicate prediction status' },
          { status: 500 }
        )
      }

      prediction = await pollRes.json()
      console.log(`[Replicate] Poll #${attempts} status:`, prediction.status, prediction.id)
    }

    if (prediction.status !== 'succeeded') {
      console.error('Replicate prediction failed', prediction)
      return NextResponse.json(
        { error: 'Image transformation failed. Please try again.' },
        { status: 500 }
      )
    }

    const output = prediction.output

    // nano-banana returns either a single URL string or an array of URLs
    let outputUrl: string | undefined
    if (typeof output === 'string') {
      outputUrl = output
    } else if (Array.isArray(output) && output.length > 0) {
      outputUrl = output[0]
    }

    if (!outputUrl) {
      console.error('Replicate prediction succeeded without usable output', prediction)
      return NextResponse.json(
        { error: 'No image URL returned from Replicate' },
        { status: 500 }
      )
    }

    console.log('[Replicate] Final prediction (succeeded):', JSON.stringify(prediction, null, 2))
    console.log('[Replicate] Output URL:', outputUrl)

    // 3. Download image from Replicate (URL expires ~1h), then upload to Supabase Storage
    if (!supabaseAdmin) {
      console.error('Supabase not configured; returning expiring Replicate URL')
      return NextResponse.json({
        image: outputUrl,
        prompt: PROMPT,
        model: version,
      })
    }

    const imageRes = await fetch(outputUrl)
    if (!imageRes.ok) {
      console.error('Failed to download image from Replicate:', imageRes.status, imageRes.statusText)
      return NextResponse.json(
        { error: 'Failed to download transformed image' },
        { status: 500 }
      )
    }

    const arrayBuffer = await imageRes.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const bucket = process.env.SUPABASE_STORAGE_BUCKET ?? DEFAULT_BUCKET
    const path = `transformed/${Date.now()}-${Math.random().toString(36).slice(2, 10)}.jpg`

    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from(bucket)
      .upload(path, buffer, {
        contentType: 'image/jpeg',
        upsert: false,
      })

    if (uploadError) {
      console.error('Supabase storage upload error:', uploadError)
      return NextResponse.json(
        { error: 'Failed to store image. Please try again.' },
        { status: 500 }
      )
    }

    const { data: urlData } = supabaseAdmin.storage.from(bucket).getPublicUrl(uploadData.path)
    const permanentUrl = urlData.publicUrl
    console.log('[Supabase] Stored image:', permanentUrl)

    return NextResponse.json({
      image: permanentUrl,
      prompt: PROMPT,
      model: version,
    })
  } catch (error) {
    console.error('Error applying filter with Replicate:', error)
    return NextResponse.json({ error: 'Failed to apply filter' }, { status: 500 })
  }
}
