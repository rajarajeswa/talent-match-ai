import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { headers } from 'next/headers'
import { SubscriptionManager } from '@/lib/subscription-manager'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_demo_key', {
  apiVersion: '2023-10-16',
})

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = headers().get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || 'whsec_demo_secret'
    )
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  // Handle the event using SubscriptionManager
  try {
    await SubscriptionManager.handleWebhookEvent(event)
    console.log(`✅ Webhook event processed: ${event.type}`)
  } catch (error) {
    console.error('❌ Error processing webhook event:', error)
    return NextResponse.json({ error: 'Failed to process event' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
