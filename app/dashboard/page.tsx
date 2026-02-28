'use client'

import { useState, useEffect } from 'react'

interface Task {
  id: string
  title: string
  description: string
  price: number
  status: string
  location: string
  posterPhone: string
  helperPhone?: string
  createdAt?: string
}

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    setLoading(true)
    try {
      const res = await fetch('/api/chores')
      const data = await res.json()
      setTasks(data)
    } catch (e) {
      console.error('Failed to load data:', e)
    }
    setLoading(false)
  }

  const completedTasks = tasks.filter(t => t.status === 'completed')
  const activeTasks = tasks.filter(t => t.status === 'taken')
  const totalRevenue = completedTasks.reduce((sum, t) => sum + (t.price || 0), 0)

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <header style={{ backgroundColor: 'white', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ backgroundColor: '#10b981', padding: '8px', borderRadius: '8px' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
            </div>
            <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#111' }}>Chore-Flash Admin</span>
          </div>
          <a href="/" style={{ color: '#059669', fontWeight: '500' }}>View App</a>
        </div>
      </header>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 16px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111', marginBottom: '24px' }}>Dashboard</h1>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
          <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '8px' }}>Total Revenue</p>
            <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#059669' }}>₹{totalRevenue.toLocaleString()}</p>
          </div>
          <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '8px' }}>Completed Tasks</p>
            <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#2563eb' }}>{completedTasks.length}</p>
          </div>
          <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '8px' }}>Active Tasks</p>
            <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#d97706' }}>{activeTasks.length}</p>
          </div>
          <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '8px' }}>Total Tasks</p>
            <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#7c3aed' }}>{tasks.length}</p>
          </div>
        </div>

        <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
          <div style={{ padding: '16px', borderBottom: '1px solid #e5e7eb' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#111' }}>Recent Tasks</h2>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ backgroundColor: '#f9fafb' }}>
                <tr>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase' }}>Task</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase' }}>Price</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase' }}>Status</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase' }}>Location</th>
                </tr>
              </thead>
              <tbody style={{ borderTop: '1px solid #e5e7eb' }}>
                {loading ? (
                  <tr>
                    <td colSpan={4} style={{ padding: '32px', textAlign: 'center', color: '#6b7280' }}>Loading...</td>
                  </tr>
                ) : tasks.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ padding: '32px', textAlign: 'center', color: '#6b7280' }}>No tasks yet</td>
                  </tr>
                ) : (
                  tasks.slice(0, 10).map((task) => (
                    <tr key={task.id} style={{ borderTop: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '16px' }}>
                        <p style={{ fontWeight: '500', color: '#111' }}>{task.title}</p>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <span style={{ fontWeight: '600', color: '#059669' }}>₹{task.price}</span>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <span style={{ 
                          display: 'inline-block', 
                          padding: '4px 10px', 
                          borderRadius: '9999px', 
                          fontSize: '12px', 
                          fontWeight: '500',
                          backgroundColor: task.status === 'completed' ? '#d1fae5' : task.status === 'taken' ? '#fef3c7' : '#dbeafe',
                          color: task.status === 'completed' ? '#065f46' : task.status === 'taken' ? '#92400e' : '#1e40af'
                        }}>
                          {task.status}
                        </span>
                      </td>
                      <td style={{ padding: '16px', color: '#6b7280', fontSize: '14px' }}>{task.location}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
