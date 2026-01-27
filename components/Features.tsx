'use client'

import { Brain, Target, Filter, TrendingUp, Shield, Zap } from 'lucide-react'

export function Features() {
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Analysis',
      description: 'Advanced machine learning algorithms analyze your resume and match it with perfect job opportunities.',
      color: 'primary'
    },
    {
      icon: Target,
      title: 'Precision Matching',
      description: 'Get job recommendations with exact match percentages based on your skills and experience.',
      color: 'premium'
    },
    {
      icon: Filter,
      title: 'Smart Filtering',
      description: 'Filter jobs by location, experience level, industry, company, and salary range.',
      color: 'primary'
    },
    {
      icon: TrendingUp,
      title: 'Career Insights',
      description: 'Track your application progress and get insights into market trends.',
      color: 'premium'
    },
    {
      icon: Shield,
      title: 'Privacy First',
      description: 'Your data is encrypted and secure. We never share your information without consent.',
      color: 'primary'
    },
    {
      icon: Zap,
      title: 'Instant Results',
      description: 'Get matched with opportunities in seconds, not days or weeks.',
      color: 'premium'
    }
  ]

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Why Choose TalentMatch AI?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience the future of job hunting with our cutting-edge AI technology and user-friendly platform.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="card group hover:shadow-lg transition-all duration-300">
              <div className={`w-14 h-14 rounded-lg bg-${feature.color}-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className={`h-7 w-7 text-${feature.color}-600`} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
