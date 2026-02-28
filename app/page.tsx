'use client'

import { useState, useEffect } from 'react'
import { Task } from '@/lib/choreService'
import { TaskCard } from '@/components/chores/TaskCard'
import { Plus, Zap, LogOut, MessageCircle, CheckCircle, ArrowRight, MapPin, Shield, Heart, Sparkles, Navigation } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface UserData {
  id: string
  name: string
  phone: string
  vpa: string
}

interface UserLocation {
  lat: number
  lng: number
}

// Haversine formula to calculate distance between two coordinates
function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1)
  const dLon = deg2rad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const d = R * c // Distance in km
  return d
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180)
}

// Get approximate location string for privacy
function getApproximateLocation(fullAddress: string): string {
  // Extract area name only
  const parts = fullAddress.split(',')
  if (parts.length > 1) {
    return 'Near ' + parts[parts.length - 2].trim()
  }
  return 'Near ' + fullAddress
}

// Calculate and return distance text
function getDistanceText(userLat: number, userLng: number, taskLocation: string): string {
  const taskCoords = addressToCoords(taskLocation)
  if (!taskCoords || !userLat) return ''
  
  const distance = getDistanceFromLatLonInKm(userLat, userLng, taskCoords.lat, taskCoords.lng)
  
  if (distance < 0.1) return 'Very close'
  if (distance < 0.5) return '500m away'
  if (distance < 1) return `${Math.round(distance * 1000)}m away`
  return `${distance.toFixed(1)}km away`
}

// Convert address to coordinates (using a simple hash-based approach for demo)
// In production, use Google Maps Geocoding API
function addressToCoords(address: string): { lat: number, lng: number } | null {
  // Simple hash to generate consistent coords from string (for demo)
  // In real app, use geocoding API
  const hash = address.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  // Use a base location (Bangalore) and add variation
  const baseLat = 12.9716 + (hash % 100 - 50) * 0.001
  const baseLng = 77.5946 + (hash % 100 - 50) * 0.001
  return { lat: baseLat, lng: baseLng }
}

export default function Home() {
  const [user, setUser] = useState<UserData | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [showLogin, setShowLogin] = useState(false)
  const [showCreate, setShowCreate] = useState(false)
  const [showVPASetup, setShowVPASetup] = useState(false)
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null)
  const [locationError, setLocationError] = useState<string | null>(null)
  const [locationLoading, setLocationLoading] = useState(false)
  
  const [phone, setPhone] = useState('')
  const [name, setName] = useState('')
  
  const [step, setStep] = useState(1)
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')
  const [location, setLocation] = useState('')
  const [description, setDescription] = useState('')
  const [vpa, setVpa] = useState('')

  // Request location on mount
  useEffect(() => {
    requestLocation()
  }, [])

  function requestLocation() {
    if (!navigator.geolocation) {
      setLocationError('Geolocation not supported')
      return
    }
    
    setLocationLoading(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        })
        setLocationLoading(false)
        // Save location for future visits
        localStorage.setItem('choreFlashLocation', JSON.stringify({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }))
      },
      (error) => {
        setLocationError('Location access denied')
        setLocationLoading(false)
        // Try to load from localStorage
        const saved = localStorage.getItem('choreFlashLocation')
        if (saved) {
          setUserLocation(JSON.parse(saved))
        }
      }
    )
  }

  // Load saved location on mount
  useEffect(() => {
    const saved = localStorage.getItem('choreFlashLocation')
    if (saved) {
      setUserLocation(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    const savedUser = localStorage.getItem('choreFlashUser')
    if (savedUser) {
      const userData = JSON.parse(savedUser)
      setUser(userData)
    }
    loadTasks()
  }, [])

  async function loadTasks() {
    setLoading(true)
    try {
      const res = await fetch('/api/chores')
      const data = await res.json()
      setTasks(data)
    } catch (e) {
      console.error('Failed to load tasks:', e)
    }
    setLoading(false)
  }

  // Filter tasks within 1km
  const filteredTasks = tasks.filter(task => {
    if (!userLocation) return true // Show all if no location
    
    const taskCoords = addressToCoords(task.location)
    if (!taskCoords) return true // Show if can't convert
    
    const distance = getDistanceFromLatLonInKm(
      userLocation.lat,
      userLocation.lng,
      taskCoords.lat,
      taskCoords.lng
    )
    
    return distance <= 1 // Within 1km
  })

  async function handleLogin() {
    if (!phone || !name) {
      alert('Please enter your name and phone number')
      return
    }
    try {
      const res = await fetch('/api/chores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'login', name, phone, vpa: '' })
      })
      const newUser = await res.json()
      setUser(newUser)
      localStorage.setItem('choreFlashUser', JSON.stringify(newUser))
      setShowLogin(false)
    } catch (e) {
      alert('Login failed. Please try again.')
    }
  }

  async function handleSaveVPA() {
    if (!vpa) {
      alert('Please enter your UPI ID')
      return
    }
    try {
      const res = await fetch('/api/chores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'updateVPA', phone: user?.phone, vpa })
      })
      const updatedUser = await res.json()
      setUser(updatedUser)
      localStorage.setItem('choreFlashUser', JSON.stringify(updatedUser))
      setShowVPASetup(false)
    } catch (e) {
      alert('Failed to save VPA')
    }
  }

  async function handleAcceptTask(taskId: string) {
    if (!user) {
      setShowLogin(true)
      return
    }
    try {
      await fetch('/api/chores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'acceptTask', taskId, helperName: user.name, helperPhone: user.phone })
      })
      loadTasks()
    } catch (e) {
      alert('Failed to accept task.')
    }
  }

  async function handleCompleteTask(taskId: string) {
    try {
      await fetch('/api/chores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'completeTask', taskId })
      })
      loadTasks()
      alert('Task marked as completed!')
    } catch (e) {
      alert('Failed to complete task.')
    }
  }

  function handleCreateTask() {
    if (step < 3) {
      setStep(step + 1)
      return
    }
    
    if (!title || !price || !location) {
      alert('Please fill all fields')
      return
    }
    
    fetch('/api/chores', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'createTask',
        task: {
          title,
          description,
          price: parseInt(price),
          status: 'open',
          location,
          posterName: user?.name || 'Unknown',
          posterPhone: user?.phone || 'Unknown'
        }
      })
    }).then(() => {
      setShowCreate(false)
      setStep(1)
      setTitle('')
      setPrice('')
      setLocation('')
      setDescription('')
      loadTasks()
    })
  }

  function getWhatsAppLink(phone: string, taskTitle: string) {
    const message = `Hi! I'm interested in helping with "${taskTitle}". When can I start?`
    return `https://wa.me/91${phone}?text=${encodeURIComponent(message)}`
  }

  function getUPILink(posterVPA: string, price: number, posterName: string) {
    return `upi://pay?pa=${posterVPA}&pn=${encodeURIComponent(posterName)}&am=${price}&cu=INR`
  }

  function handleLogout() {
    setUser(null)
    localStorage.removeItem('choreFlashUser')
  }

  const priceOptions = [
    { label: '₹50', value: '50' },
    { label: '₹100', value: '100' },
    { label: '₹200', value: '200' },
    { label: '₹500', value: '500' }
  ]

  const openTasks = filteredTasks.filter(t => t.status === 'open')
  const otherTasks = filteredTasks.filter(t => t.status !== 'open')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <motion.header 
        initial={{ y: -60 }}
        animate={{ y: 0 }}
        className="bg-white shadow-sm sticky top-0 z-10"
      >
        <div className="max-w-md mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-emerald-500 p-1.5 rounded-lg">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl text-gray-900">Chore-Flash</span>
          </div>
          <div className="flex items-center gap-2">
            {/* Location Button */}
            <button 
              onClick={requestLocation}
              className={`p-1.5 rounded-lg ${userLocation ? 'text-emerald-600 bg-emerald-50' : 'text-gray-500'}`}
              title={userLocation ? 'Location enabled' : 'Enable location'}
            >
              <Navigation className={`h-4 w-4 ${locationLoading ? 'animate-pulse' : ''}`} />
            </button>
            {user ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">{user.name}</span>
                <button onClick={handleLogout} className="p-1.5 text-gray-500 hover:text-gray-700">
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button onClick={() => setShowLogin(true)} className="bg-emerald-500 text-white text-sm font-medium px-3 py-1.5 rounded-lg">
                Sign In
              </button>
            )}
          </div>
        </div>
      </motion.header>

      <main className="max-w-md mx-auto px-4 py-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Nearby Chores</h1>
          <p className="text-gray-600 text-sm">
            {userLocation 
              ? 'Showing tasks within 1km of your location' 
              : 'Enable location to see nearby tasks'}
          </p>
        </motion.div>

        {loading ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8"
          >
            <div className="animate-spin h-8 w-8 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto"></div>
          </motion.div>
        ) : filteredTasks.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12 bg-white rounded-2xl"
          >
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="h-10 w-10 text-emerald-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {userLocation ? 'No chores nearby!' : 'Enable location'}
            </h3>
            <p className="text-gray-500 mb-4">
              {userLocation 
                ? 'No tasks within 1km of you' 
                : 'Allow location to see chores near you'}
            </p>
            {!userLocation && (
              <button 
                onClick={requestLocation}
                className="bg-emerald-500 text-white px-6 py-2 rounded-lg font-medium"
              >
                Enable Location
              </button>
            )}
            {userLocation && user && (
              <button 
                onClick={() => setShowCreate(true)}
                className="bg-emerald-500 text-white px-6 py-2 rounded-lg font-medium"
              >
                Post a Chore
              </button>
            )}
          </motion.div>
        ) : (
          <div className="space-y-4">
            {openTasks.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <h3 className="text-sm font-medium text-gray-500 mb-2">Available Now</h3>
                <div className="space-y-3">
                  <AnimatePresence>
                    {openTasks.map((task, index) => (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <TaskCard 
                          task={task} 
                          user={user}
                          onAccept={handleAcceptTask}
                          onComplete={handleCompleteTask}
                          onWhatsAppClick={getWhatsAppLink}
                          onUPIClick={getUPILink}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}

            {otherTasks.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <h3 className="text-sm font-medium text-gray-500 mb-2">In Progress</h3>
                <div className="space-y-3">
                  <AnimatePresence>
                    {otherTasks.map((task, index) => (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                      >
                        <TaskCard 
                          task={task} 
                          user={user}
                          onAccept={handleAcceptTask}
                          onComplete={handleCompleteTask}
                          onWhatsAppClick={getWhatsAppLink}
                          onUPIClick={getUPILink}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </main>

      {/* FAB */}
      {user && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowCreate(true)}
          className="fixed bottom-6 right-6 bg-emerald-500 hover:bg-emerald-600 text-white p-4 rounded-full shadow-lg"
        >
          <Plus className="h-6 w-6" />
        </motion.button>
      )}

      {/* Login Modal */}
      <AnimatePresence>
        {showLogin && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-sm"
            >
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-5 w-5 text-emerald-500" />
                <h2 className="text-xl font-bold text-gray-900">Welcome to Chore-Flash</h2>
              </div>
              
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 mb-4"
              >
                <div className="flex items-start gap-2">
                  <Shield className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-emerald-700">
                    <strong>Privacy Shield:</strong> We do not store your passwords or bank details. All payments happen directly via your own UPI app.
                  </p>
                </div>
              </motion.div>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray1">Phone Number-700 mb-</label>
                  <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="w-full px-4 py-2 border rounded-lg" />
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                <button onClick={() => setShowLogin(false)} className="flex-1 px-4 py-2 border rounded-lg">Cancel</button>
                <button onClick={handleLogin} className="flex-1 px-4 py-2 bg-emerald-500 text-white rounded-lg">Continue</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* VPA Setup Modal */}
      <AnimatePresence>
        {showVPASetup && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-2xl p-6 w-full max-w-sm"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-2">Set Your UPI ID</h2>
              <p className="text-gray-600 text-sm mb-4">You'll receive payments here</p>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">UPI ID (e.g., name@upi)</label>
                <input type="text" value={vpa} onChange={e => setVpa(e.target.value)} placeholder="yourname@oksbi" className="w-full px-4 py-2 border rounded-lg" />
              </div>
              <div className="flex gap-3 mt-4">
                <button onClick={() => setShowVPASetup(false)} className="flex-1 px-4 py-2 border rounded-lg">Skip</button>
                <button onClick={handleSaveVPA} className="flex-1 px-4 py-2 bg-emerald-500 text-white rounded-lg">Save</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3-Step Create Task Modal */}
      <AnimatePresence>
        {showCreate && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-2xl p-6 w-full max-w-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Post a Chore</h2>
                <span className="text-sm text-gray-500">Step {step} of 3</span>
              </div>
              
              <div className="flex gap-2 mb-4">
                {[1,2,3].map(s => (
                  <motion.div 
                    key={s}
                    className={`h-1 flex-1 rounded ${s <= step ? 'bg-emerald-500' : 'bg-gray-200'}`}
                  />
                ))}
              </div>

              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-2">What is the chore?</label>
                    <input 
                      type="text" 
                      value={title} 
                      onChange={e => setTitle(e.target.value)} 
                      placeholder="e.g., Walk my dog" 
                      className="w-full px-4 py-3 border rounded-lg text-lg"
                      autoFocus
                    />
                    <textarea 
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      placeholder="Add details (optional)"
                      rows={2}
                      className="w-full px-4 py-2 border rounded-lg mt-2"
                    />
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-3">What is the price?</label>
                    <div className="grid grid-cols-2 gap-3">
                      {priceOptions.map(p => (
                        <motion.button
                          key={p.value}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setPrice(p.value)}
                          className={`py-4 rounded-lg text-lg font-semibold border-2 ${price === p.value ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-gray-200'}`}
                        >
                          {p.label}
                        </motion.button>
                      ))}
                    </div>
                    <input 
                      type="number" 
                      value={price} 
                      onChange={e => setPrice(e.target.value)} 
                      placeholder="Custom amount" 
                      className="w-full px-4 py-2 border rounded-lg mt-3"
                    />
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-2">Where are you?</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input 
                        type="text" 
                        value={location} 
                        onChange={e => setLocation(e.target.value)} 
                        placeholder="e.g., HSR Layout, Bangalore" 
                        className="w-full pl-10 pr-4 py-3 border rounded-lg"
                        autoFocus
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex gap-3 mt-6">
                <button 
                  onClick={() => { setShowCreate(false); setStep(1); }} 
                  className="flex-1 px-4 py-2 border rounded-lg"
                >
                  Cancel
                </button>
                <motion.button 
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCreateTask} 
                  className="flex-1 px-4 py-2 bg-emerald-500 text-white rounded-lg flex items-center justify-center gap-2"
                >
                  {step < 3 ? 'Next' : 'Post Task'}
                  {step < 3 && <ArrowRight className="h-4 w-4" />}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
