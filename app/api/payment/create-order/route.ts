import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { razorpay } from '@/lib/razorpay'
import { createOrder } from '@/lib/db/orders'
import { getUserByClerkId } from '@/lib/db/users'

export async function POST(request: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { amount } = await request.json() // amount in rupees

    if (!amount || amount < 1) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
    }

    // Get user from database
    const user = await getUserByClerkId(userId)
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Convert to paise (smallest currency unit)
    const amountInPaise = Math.round(amount * 100)

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt: `order_${Date.now()}`,
    })

    // Save order to database
    await createOrder({
      userId: user.id,
      razorpayOrderId: razorpayOrder.id,
      amount: amountInPaise,
      currency: 'INR',
      status: 'pending',
    })

    return NextResponse.json({
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    })
  } catch (error) {
    console.error('Error creating Razorpay order:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}
