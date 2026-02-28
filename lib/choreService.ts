// Chore-Flash Service - JSON-based data layer
// Ready for Google Sheets API integration later

import fs from 'fs'
import path from 'path'

export interface Task {
  id: string
  title: string
  description: string
  price: number
  status: 'open' | 'taken' | 'completed'
  location: string
  posterName: string
  posterPhone: string
  helperName?: string
  helperPhone?: string
  createdAt: string
}

export interface User {
  id: string
  name: string
  phone: string
  rating: number
  role: 'neighbor'
  tasksPosted: number
  tasksHelped: number
}

const DATA_FILE = path.join(process.cwd(), 'lib', 'data', 'chores.json')

// Initialize data file if it doesn't exist
function ensureDataFile() {
  const dataDir = path.dirname(DATA_FILE)
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
  if (!fs.existsSync(DATA_FILE)) {
    const initialData = {
      tasks: [
        {
          id: '1',
          title: 'Walk my dog',
          description: 'Need someone to walk my golden retriever for 20 minutes',
          price: 100,
          status: 'open',
          location: 'HSR Layout, Sector 1',
          posterName: 'Rahul',
          posterPhone: '9876543210',
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          title: 'Move sofa',
          description: 'Help me move a sofa from one room to another',
          price: 150,
          status: 'open',
          location: 'Koramangala, 5th Block',
          posterName: 'Priya',
          posterPhone: '9876543211',
          createdAt: new Date().toISOString()
        },
        {
          id: '3',
          title: 'Peel garlic',
          description: 'Need help peeling 1kg of garlic for cooking',
          price: 50,
          status: 'open',
          location: 'BTM Layout',
          posterName: 'Suresh',
          posterPhone: '9876543212',
          createdAt: new Date().toISOString()
        }
      ],
      users: []
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2))
  }
}

function readData() {
  ensureDataFile()
  const data = fs.readFileSync(DATA_FILE, 'utf-8')
  return JSON.parse(data)
}

function writeData(data: any) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2))
}

// Task functions
export async function getOpenTasks(): Promise<Task[]> {
  const data = readData()
  return data.tasks.filter((t: Task) => t.status === 'open')
}

export async function getAllTasks(): Promise<Task[]> {
  const data = readData()
  return data.tasks
}

export async function createTask(task: Omit<Task, 'id' | 'createdAt'>): Promise<Task> {
  const data = readData()
  const newTask: Task = {
    ...task,
    id: Date.now().toString(),
    createdAt: new Date().toISOString()
  }
  data.tasks.unshift(newTask)
  writeData(data)
  return newTask
}

export async function acceptTask(taskId: string, helperName: string, helperPhone: string): Promise<Task | null> {
  const data = readData()
  const taskIndex = data.tasks.findIndex((t: Task) => t.id === taskId && t.status === 'open')
  
  if (taskIndex === -1) return null
  
  data.tasks[taskIndex] = {
    ...data.tasks[taskIndex],
    status: 'taken',
    helperName,
    helperPhone
  }
  writeData(data)
  return data.tasks[taskIndex]
}

export async function completeTask(taskId: string): Promise<Task | null> {
  const data = readData()
  const taskIndex = data.tasks.findIndex((t: Task) => t.id === taskId && t.status === 'taken')
  
  if (taskIndex === -1) return null
  
  data.tasks[taskIndex] = {
    ...data.tasks[taskIndex],
    status: 'completed'
  }
  writeData(data)
  return data.tasks[taskIndex]
}

// User functions
export async function getOrCreateUser(phone: string, name: string): Promise<User> {
  const data = readData()
  let user = data.users.find((u: User) => u.phone === phone)
  
  if (!user) {
    user = {
      id: Date.now().toString(),
      name,
      phone,
      rating: 5.0,
      role: 'neighbor',
      tasksPosted: 0,
      tasksHelped: 0
    }
    data.users.push(user)
    writeData(data)
  }
  
  return user
}

export async function getUserByPhone(phone: string): Promise<User | null> {
  const data = readData()
  return data.users.find((u: User) => u.phone === phone) || null
}
