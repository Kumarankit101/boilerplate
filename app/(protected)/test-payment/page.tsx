import { PaymentButton } from '@/components/payment-button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function TestPaymentPage() {
  return (
    <div className="container mx-auto max-w-2xl p-8">
      <Card>
        <CardHeader>
          <CardTitle>Test Payment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Test the Razorpay payment integration with test cards.
          </p>

          <div className="space-y-2">
            <h3 className="font-semibold">Test Card Details:</h3>
            <ul className="text-muted-foreground list-inside list-disc text-sm">
              <li>Card Number: 4111 1111 1111 1111</li>
              <li>CVV: Any 3 digits</li>
              <li>Expiry: Any future date</li>
            </ul>
          </div>

          <div className="flex gap-4">
            <div className="flex-1 rounded-lg border p-4">
              <p className="mb-2 text-lg font-semibold">₹100</p>
              <PaymentButton amount={100} label="Pay ₹100" />
            </div>
            <div className="flex-1 rounded-lg border p-4">
              <p className="mb-2 text-lg font-semibold">₹500</p>
              <PaymentButton amount={500} label="Pay ₹500" />
            </div>
            <div className="flex-1 rounded-lg border p-4">
              <p className="mb-2 text-lg font-semibold">₹1000</p>
              <PaymentButton amount={1000} label="Pay ₹1000" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
