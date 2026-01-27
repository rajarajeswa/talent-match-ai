import { loadStripe } from '@stripe/stripe-js'

export const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_demo_key'
)

export const createCheckoutSession = async (priceId: string) => {
  try {
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ priceId }),
    })

    if (!response.ok) {
      throw new Error('Failed to create checkout session')
    }

    const { sessionId } = await response.json()
    return sessionId
  } catch (error) {
    console.error('Checkout session error:', error)
    throw error
  }
}

export const pricingPlans = {
  premium: {
    monthly: 'price_monthly_premium',
    yearly: 'price_yearly_premium'
  },
  enterprise: {
    monthly: 'price_monthly_enterprise',
    yearly: 'price_yearly_enterprise'
  }
}
