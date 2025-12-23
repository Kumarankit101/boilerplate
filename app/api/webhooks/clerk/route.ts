import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { createUser } from '@/lib/db/users'

export async function POST(req: Request) {
  // Get the headers
  const headerPayload = await headers()
  const svixId = headerPayload.get('svix-id')
  const svixTimestamp = headerPayload.get('svix-timestamp')
  const svixSignature = headerPayload.get('svix-signature')

  // If there are no headers, error out
  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json({ error: 'Missing svix headers' }, { status: 400 })
  }

  // Get the body
  const payload = await req.text()
  const body = JSON.parse(payload)

  // Get the Clerk webhook secret
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    console.error('CLERK_WEBHOOK_SECRET is not set')
    return NextResponse.json(
      { error: 'Webhook secret not configured' },
      { status: 500 }
    )
  }

  // Create a new Svix instance with your webhook secret
  const wh = new Webhook(WEBHOOK_SECRET)

  let evt: any

  // Verify the webhook signature
  try {
    evt = wh.verify(payload, {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    }) as any
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  // Handle the webhook event
  const eventType = evt.type

  if (eventType === 'user.created') {
    const { id, email_addresses, first_name, last_name } = evt.data

    try {
      // Get the primary email address
      const primaryEmail = email_addresses.find(
        (email: any) => email.id === evt.data.primary_email_address_id
      )

      if (!primaryEmail) {
        console.error('No primary email found for user:', id)
        return NextResponse.json(
          { error: 'No primary email found' },
          { status: 400 }
        )
      }

      // Create full name
      const fullName = `${first_name || ''} ${last_name || ''}`.trim()

      // Create user in database
      await createUser({
        clerkUserId: id,
        email: primaryEmail.email_address,
        name: fullName || undefined,
      })

      console.log('User created in database:', id)

      return NextResponse.json({ message: 'User created successfully' })
    } catch (error) {
      console.error('Error creating user in database:', error)
      return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 500 }
      )
    }
  }

  if (eventType === 'user.updated') {
    // Handle user updates if needed
    console.log('User updated:', evt.data.id)
    // You could implement updateUser logic here if needed
    return NextResponse.json({ message: 'User update noted' })
  }

  if (eventType === 'user.deleted') {
    // Handle user deletion if needed
    console.log('User deleted:', evt.data.id)
    // You could implement deleteUser logic here if needed
    return NextResponse.json({ message: 'User deletion noted' })
  }

  return NextResponse.json({ message: 'Webhook received' })
}
