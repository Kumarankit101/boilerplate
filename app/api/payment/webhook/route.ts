import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { updateOrderStatus } from '@/lib/db/orders'

export async function POST(request: Request) {
  try {
    const body = await request.text()
    const signature = request.headers.get('x-razorpay-signature')

    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
    }

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET!)
      .update(body)
      .digest('hex')

    if (signature !== expectedSignature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    const event = JSON.parse(body)

    // Handle different event types
    switch (event.event) {
      case 'payment.captured':
        await updateOrderStatus(event.payload.payment.entity.order_id, {
          status: 'completed',
          razorpayPaymentId: event.payload.payment.entity.id,
        })
        console.log('Payment captured:', event.payload.payment.entity.id)
        break

      case 'payment.failed':
        await updateOrderStatus(event.payload.payment.entity.order_id, {
          status: 'failed',
        })
        console.log('Payment failed:', event.payload.payment.entity.id)
        break

      default:
        console.log('Unhandled event:', event.event)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}
