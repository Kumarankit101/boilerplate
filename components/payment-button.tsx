'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'

interface PaymentButtonProps {
  amount: number
  label?: string
}

declare global {
  interface Window {
    Razorpay: any
  }
}

export function PaymentButton({
  amount,
  label = 'Pay Now',
}: PaymentButtonProps) {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }

  const handlePayment = async () => {
    setLoading(true)

    try {
      // Load Razorpay script
      const res = await loadRazorpayScript()
      if (!res) {
        toast({
          title: 'Error',
          description: 'Failed to load payment gateway',
          variant: 'destructive',
        })
        setLoading(false)
        return
      }

      // Create order
      const orderResponse = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount }),
      })

      if (!orderResponse.ok) {
        throw new Error('Failed to create order')
      }

      const orderData = await orderResponse.json()

      // Initialize Razorpay
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        order_id: orderData.orderId,
        name: 'Your App Name',
        description: 'Payment for services',
        handler: async function (response: any) {
          try {
            // Verify payment
            const verifyResponse = await fetch('/api/payment/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            })

            if (verifyResponse.ok) {
              toast({
                title: 'Success!',
                description: 'Payment completed successfully',
              })
            } else {
              throw new Error('Payment verification failed')
            }
          } catch (error) {
            toast({
              title: 'Error',
              description: 'Payment verification failed',
              variant: 'destructive',
            })
          }
        },
        prefill: {
          name: '',
          email: '',
        },
        theme: {
          color: '#3399cc',
        },
      }

      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Payment initiation failed',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button onClick={handlePayment} disabled={loading}>
      {loading ? 'Processing...' : label}
    </Button>
  )
}
