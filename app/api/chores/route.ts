import { NextResponse } from 'next/server'
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

const DATA_FILE = path.join(process.cwd(), 'lib', 'data', 'chores.json')

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

// GET - Get all tasks
export async function GET() {
  const data = readData()
  return NextResponse.json(data.tasks)
}

// POST - Handle all actions
export async function POST(request: Request) {
  const body = await request.json()
  const data = readData()
  
  if (body.type === 'createTask') {
    const newTask: Task = {
      ...body.task,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    }
    data.tasks.unshift(newTask)
    writeData(data)
    return NextResponse.json(newTask)
  }
  
  if (body.type === 'login') {
    let user = data.users.find((u: any) => u.phone === body.phone)
    if (!user) {
      user = {
        id: Date.now().toString(),
        name: body.name,
        phone: body.phone,
        vpa: body.vpa || '',
        rating: 5.0,
        role: 'neighbor',
        tasksPosted: 0,
        tasksHelped: 0
      }
      data.users.push(user)
      writeData(data)
    }
    return NextResponse.json(user)
  }
  
  if (body.type === 'acceptTask') {
    const taskIndex = data.tasks.findIndex((t: Task) => t.id === body.taskId && t.status === 'open')
    if (taskIndex === -1) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }
    data.tasks[taskIndex] = {
      ...data.tasks[taskIndex],
      status: 'taken',
      helperName: body.helperName,
      helperPhone: body.helperPhone
    }
    writeData(data)
    return NextResponse.json(data.tasks[taskIndex])
  }
  
  if (body.type === 'completeTask') {
    const taskIndex = data.tasks.findIndex((t: Task) => t.id === body.taskId && t.status === 'taken')
    if (taskIndex === -1) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }
    data.tasks[taskIndex] = {
      ...data.tasks[taskIndex],
      status: 'completed'
    }
    writeData(data)
    return NextResponse.json(data.tasks[taskIndex])
  }
  
  if (body.type === 'updateVPA') {
    const userIndex = data.users.findIndex((u: any) => u.phone === body.phone)
    if (userIndex !== -1) {
      data.users[userIndex].vpa = body.vpa
      writeData(data)
      return NextResponse.json(data.users[userIndex])
    }
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }
  
  return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
}
