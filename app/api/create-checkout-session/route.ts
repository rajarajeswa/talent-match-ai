import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { SubscriptionManager } from '@/lib/subscription-manager'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_demo_key', {
  apiVersion: '2023-10-16',
})

// Stripe price IDs (you need to create these in your Stripe dashboard)
const STRIPE_PRICES = {
  premium: 'price_premium_monthly', // Replace with actual Stripe price ID
  professional: 'price_professional_monthly', // Replace with actual Stripe price ID
  enterprise: 'price_enterprise_monthly', // Replace with actual Stripe price ID
}

export async function POST(request: NextRequest) {
  try {
    const { plan, userId } = await request.json()

    if (!plan || !userId) {
      return NextResponse.json(
        { error: 'Plan and userId are required' },
        { status: 400 }
      )
    }

    // Check if Stripe is properly configured
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY
    const isConfigured = stripeSecretKey && 
      stripeSecretKey !== 'sk_test_demo_key' && 
      !stripeSecretKey.includes('demo')

    if (!isConfigured) {
      // Return demo response
      return NextResponse.json({ 
        sessionId: 'demo_session_' + Date.now(),
        url: null, // Indicates demo mode
        demo: true,
        message: 'Stripe not configured - demo mode active'
      })
    }

    const priceId = STRIPE_PRICES[plan as keyof typeof STRIPE_PRICES]
    
    if (!priceId) {
      return NextResponse.json(
        { error: 'Invalid plan selected' },
        { status: 400 }
      )
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${request.nextUrl.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.nextUrl.origin}/pricing?canceled=true`,
      metadata: {
        userId: userId,
        plan: plan,
      },
      subscription_data: {
        trial_period_days: 7, // 7-day free trial
        metadata: {
          userId: userId,
          plan: plan,
        },
      },
      customer_email: 'customer@example.com', // In production, get from user profile
    })

    return NextResponse.json({ 
      sessionId: session.id,
      url: session.url,
      demo: false
    })
  } catch (error) {
    console.error('Stripe session error:', error)
    
    // Fallback to demo mode on any error
    return NextResponse.json({ 
      sessionId: 'demo_session_' + Date.now(),
      url: null,
      demo: true,
      error: 'Stripe error - demo mode active'
    })
  }
}
