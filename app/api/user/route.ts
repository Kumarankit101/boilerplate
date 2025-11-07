import { auth, currentUser } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { updateUserSchema } from '@/lib/validations/user'
import { getUserByClerkId, createUser, updateUser } from '@/lib/db/users'

export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let user = await getUserByClerkId(userId)

    if (!user) {
      const clerkUser = await currentUser()
      if (!clerkUser) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
      }

      const fullName =
        `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim()
      user = await createUser({
        clerkUserId: userId,
        email: clerkUser.emailAddresses[0]?.emailAddress || '',
        name: fullName || undefined,
      })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('Error in GET /api/user:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validation = updateUserSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.issues },
        { status: 400 }
      )
    }

    const updatedUser = await updateUser(userId, validation.data)

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error('Error in PATCH /api/user:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
