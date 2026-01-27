import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { plan } = await request.json()
    
    // Create a trial session without Stripe
    const trialData = {
      plan: plan || 'enterprise',
      trialStart: new Date().toISOString(),
      trialEnd: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
      features: getTrialFeatures(plan),
      sessionId: `trial_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    }
    
    console.log(`Trial started for ${plan}:`, trialData)
    
    return NextResponse.json({
      sprofessional: [
        'Everything in Premium',
        '5 ATS resume templates',
        'Instant Apply System (10 jobs/month)',
        'Perfect Match Algorithm',
        'PDF download capability',
        'Resume optimization tools',
        'Priority email support'
      ],
      business: [true],
      trialData,
      message: `${plan.charAt(0).toUpperCase() + plan.slice(1)} trial started successfully!`
    })
  } catch (error: any) {
    console.error('Trial start error:', error)
    return NextResponse.json(
      { error: 'Failed to start trial: ' + error.message },
      { status: 500 }
    )
  }
}

function getTrialFeatures(plan: string): string[] {
  const features = {
    enterprise: [
      'Unlimited job searches',
      'Advanced AI recommendations',
      'Team collaboration tools',
      'Custom integrations',
      'Dedicated account manager',
      'API access',
      'Priority support',
      'Resume optimization',
      'Interview preparation',
      'Advanced filtering'
    ],
    professional: [
      'Everything in Premium',
      '5 ATS resume templates',
      'Instant Apply System (10 jobs/month)',
      'Perfect Match Algorithm',
      'PDF download capability',
      'Resume optimization tools',
      'Priority email support'
    ],
    premium: [
      'Unlimited resume uploads',
      'Advanced AI analysis',
      'Unlimited job matches',
      'Advanced filtering',
      'Resume optimization',
      'Priority email support'
    ]
  }
  
  return features[plan as keyof typeof features] || features.enterprise
}
