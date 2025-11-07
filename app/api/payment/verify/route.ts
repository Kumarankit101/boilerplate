import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { updateOrderStatus } from '@/lib/db/orders'

export async function POST(request: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      await request.json()

    // Verify signature
    const sign = razorpay_order_id + '|' + razorpay_payment_id
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(sign.toString())
      .digest('hex')

    if (razorpay_signature !== expectedSign) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    // Update order in database
    await updateOrderStatus(razorpay_order_id, {
      status: 'completed',
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error verifying payment:', error)
    return NextResponse.json(
      { error: 'Payment verification failed' },
      { status: 500 }
    )
  }
}
