import { prisma } from '@/lib/prisma'

export async function createOrder(data: {
  userId: string
  razorpayOrderId: string
  amount: number
  currency?: string
  status: string
}) {
  try {
    return await prisma.order.create({
      data,
    })
  } catch (error) {
    console.error('Error creating order:', error)
    throw error
  }
}

export async function getOrderByRazorpayId(razorpayOrderId: string) {
  try {
    return await prisma.order.findUnique({
      where: { razorpayOrderId },
      include: { user: true },
    })
  } catch (error) {
    console.error('Error fetching order:', error)
    return null
  }
}

export async function updateOrderStatus(
  razorpayOrderId: string,
  data: {
    status: string
    razorpayPaymentId?: string
    razorpaySignature?: string
  }
) {
  try {
    return await prisma.order.update({
      where: { razorpayOrderId },
      data,
    })
  } catch (error) {
    console.error('Error updating order:', error)
    throw error
  }
}
