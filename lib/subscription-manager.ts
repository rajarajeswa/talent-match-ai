// SUBSCRIPTION MANAGER - Handle real payments and access control

export interface Subscription {
  id: string
  userId: string
  plan: 'premium' | 'professional' | 'enterprise'
  status: 'trialing' | 'active' | 'cancelled' | 'past_due'
  currentPeriodEnd: string
  trialEnd?: string
  stripeSubscriptionId?: string
  createdAt: string
  updatedAt: string
}

export class SubscriptionManager {
  // Get user's current subscription
  static async getSubscription(userId: string): Promise<Subscription | null> {
    try {
      // In production, this would query your database
      const subscriptionData = localStorage.getItem(`subscription_${userId}`)
      
      if (!subscriptionData) {
        return null
      }
      
      const subscription: Subscription = JSON.parse(subscriptionData)
      
      // Check if subscription is still valid
      const now = new Date()
      const endDate = new Date(subscription.currentPeriodEnd)
      
      if (now > endDate && subscription.status !== 'cancelled') {
        // Subscription expired, update status
        subscription.status = 'past_due'
        localStorage.setItem(`subscription_${userId}`, JSON.stringify(subscription))
      }
      
      return subscription
    } catch (error) {
      console.error('Error getting subscription:', error)
      return null
    }
  }
  
  // Check if user has active subscription
  static async hasActiveSubscription(userId: string): Promise<boolean> {
    const subscription = await this.getSubscription(userId)
    
    if (!subscription) {
      return false
    }
    
    const now = new Date()
    const endDate = new Date(subscription.currentPeriodEnd)
    
    return subscription.status === 'active' && now <= endDate
  }
  
  // Check if user is in trial period
  static async isInTrial(userId: string): Promise<boolean> {
    const subscription = await this.getSubscription(userId)
    
    if (!subscription || !subscription.trialEnd) {
      return false
    }
    
    const now = new Date()
    const trialEnd = new Date(subscription.trialEnd)
    
    return subscription.status === 'trialing' && now <= trialEnd
  }
  
  // Get user's plan based on subscription
  static async getUserPlan(userId: string): Promise<'free' | 'premium' | 'professional' | 'enterprise'> {
    const hasActive = await this.hasActiveSubscription(userId)
    const inTrial = await this.isInTrial(userId)
    
    if (!hasActive && !inTrial) {
      return 'free'
    }
    
    const subscription = await this.getSubscription(userId)
    return subscription?.plan || 'free'
  }
  
  // Create new subscription (called after successful payment)
  static async createSubscription(userId: string, plan: string, stripeSubscriptionId: string): Promise<Subscription> {
    const now = new Date()
    const trialEnd = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000) // 7 days trial
    const periodEnd = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000) // 30 days after trial
    
    const subscription: Subscription = {
      id: `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      plan: plan as 'premium' | 'professional' | 'enterprise',
      status: 'trialing',
      currentPeriodEnd: periodEnd.toISOString(),
      trialEnd: trialEnd.toISOString(),
      stripeSubscriptionId,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString()
    }
    
    // Save to localStorage (in production, save to database)
    localStorage.setItem(`subscription_${userId}`, JSON.stringify(subscription))
    
    return subscription
  }
  
  // Cancel subscription
  static async cancelSubscription(userId: string): Promise<void> {
    const subscription = await this.getSubscription(userId)
    
    if (!subscription) {
      return
    }
    
    subscription.status = 'cancelled'
    subscription.updatedAt = new Date().toISOString()
    
    localStorage.setItem(`subscription_${userId}`, JSON.stringify(subscription))
  }
  
  // Handle webhook events from Stripe
  static async handleWebhookEvent(event: any): Promise<void> {
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object
        const userId = session.metadata?.userId
        
        if (userId) {
          // Extract plan from session metadata or line items
          const plan = this.extractPlanFromSession(session)
          const stripeSubscriptionId = session.subscription as string
          
          await this.createSubscription(userId, plan, stripeSubscriptionId)
          console.log(`✅ Subscription created for user ${userId}, plan: ${plan}`)
        }
        break
        
      case 'invoice.payment_succeeded':
        const invoice = event.data.object
        const subscriptionId = invoice.subscription as string
        
        // Update subscription status to active
        await this.updateSubscriptionStatus(subscriptionId, 'active')
        console.log(`✅ Payment succeeded for subscription ${subscriptionId}`)
        break
        
      case 'invoice.payment_failed':
        const failedInvoice = event.data.object
        const failedSubscriptionId = failedInvoice.subscription as string
        
        // Update subscription status to past_due
        await this.updateSubscriptionStatus(failedSubscriptionId, 'past_due')
        console.log(`❌ Payment failed for subscription ${failedSubscriptionId}`)
        break
        
      case 'customer.subscription.deleted':
        const deletedSubscription = event.data.object
        await this.updateSubscriptionStatus(deletedSubscription.id, 'cancelled')
        console.log(`🚫 Subscription cancelled: ${deletedSubscription.id}`)
        break
        
      default:
        console.log(`Unhandled webhook event: ${event.type}`)
    }
  }
  
  // Extract plan from Stripe session
  private static extractPlanFromSession(session: any): string {
    // In production, this would extract from session metadata or line items
    // For demo, we'll use a simple approach
    const amount = session.amount_total || 0
    
    if (amount >= 19900) return 'enterprise' // $199
    if (amount >= 4900) return 'professional' // $49
    if (amount >= 2900) return 'premium' // $29
    
    return 'premium'
  }
  
  // Update subscription status
  private static async updateSubscriptionStatus(stripeSubscriptionId: string, status: string): Promise<void> {
    // Find subscription by stripe ID and update status
    // In production, this would query your database
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith('subscription_')) {
        const subscriptionData = localStorage.getItem(key)
        if (subscriptionData) {
          const subscription: Subscription = JSON.parse(subscriptionData)
          if (subscription.stripeSubscriptionId === stripeSubscriptionId) {
            subscription.status = status as any
            subscription.updatedAt = new Date().toISOString()
            localStorage.setItem(key, JSON.stringify(subscription))
            break
          }
        }
      }
    }
  }
  
  // Clean up expired subscriptions
  static async cleanupExpiredSubscriptions(): Promise<void> {
    const now = new Date()
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith('subscription_')) {
        const subscriptionData = localStorage.getItem(key)
        if (subscriptionData) {
          const subscription: Subscription = JSON.parse(subscriptionData)
          const endDate = new Date(subscription.currentPeriodEnd)
          
          if (now > endDate && subscription.status !== 'cancelled') {
            subscription.status = 'past_due'
            localStorage.setItem(key, JSON.stringify(subscription))
          }
        }
      }
    }
  }
}
