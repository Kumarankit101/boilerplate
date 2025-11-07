import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { exampleFormSchema } from '@/lib/validations/example-form'

export async function POST(request: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validation = exampleFormSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.issues },
        { status: 400 }
      )
    }

    // Here you would typically save to database
    console.log('Form submitted:', validation.data)

    return NextResponse.json({
      success: true,
      data: validation.data,
    })
  } catch (error) {
    console.error('Error in POST /api/example-form:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
