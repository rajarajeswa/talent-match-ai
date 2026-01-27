'use client'

import { useState } from 'react'
import { useAuth } from '@/components/AuthProvider'
import { signInWithGoogle } from '@/lib/auth'
import { Upload, Sparkles, ArrowRight, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export function Hero() {
  const { user } = useAuth()

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-premium-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
        <div className="text-center">
          <div className="flex justify-center mb-8">
            <div className="bg-gradient-to-r from-primary-600 to-premium-600 p-3 rounded-full">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
          </div>
          
          <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6">
            Find Your Perfect Job with
            <span className="bg-gradient-to-r from-primary-600 to-premium-600 bg-clip-text text-transparent">
              {' '}AI-Powered Matching
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Upload your resume, let our AI analyze your skills, and discover tailored job opportunities with precise match percentages. Smart, fast, and personalized.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            {user ? (
              <Link href="/dashboard" className="btn-primary text-lg px-8 py-4">
                Go to Dashboard
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            ) : (
              <button
                onClick={signInWithGoogle}
                className="btn-primary text-lg px-8 py-4"
              >
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
            )}
            
            <Link href="/features" className="btn-secondary text-lg px-8 py-4">
              Learn More
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="flex items-center justify-center space-x-3">
              <CheckCircle className="h-6 w-6 text-green-500" />
              <span className="text-gray-700 font-medium">Free Resume Analysis</span>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <CheckCircle className="h-6 w-6 text-green-500" />
              <span className="text-gray-700 font-medium">AI Job Matching</span>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <CheckCircle className="h-6 w-6 text-green-500" />
              <span className="text-gray-700 font-medium">No Credit Card Required</span>
            </div>
          </div>
        </div>
        
        <div className="mt-16 relative">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 max-w-4xl mx-auto">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">How It Works</h3>
              <p className="text-gray-600">Get matched with your dream job in 3 simple steps</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="h-8 w-8 text-primary-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">1. Upload Resume</h4>
                <p className="text-gray-600 text-sm">Upload your resume in PDF, DOC, or DOCX format</p>
              </div>
              
              <div className="text-center">
                <div className="bg-premium-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="h-8 w-8 text-premium-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">2. AI Analysis</h4>
                <p className="text-gray-600 text-sm">Our AI analyzes your skills and experience</p>
              </div>
              
              <div className="text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">3. Get Matches</h4>
                <p className="text-gray-600 text-sm">Receive personalized job recommendations</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
