'use client'

import { signOut } from 'next-auth/react'
import Link from 'next/link'

interface NavigationProps {
  user: {
    name?: string | null
    email?: string | null
    role?: string
  }
}

export function Navigation({ user }: NavigationProps) {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/dashboard" className="text-xl font-semibold text-gray-900">
              SAB 99 Tracker
            </Link>
            <div className="ml-10 flex space-x-8">
              <Link 
                href="/dashboard" 
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Dashboard
              </Link>
              <Link 
                href="/dashboard/new-entry" 
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                New Entry
              </Link>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              <span className="font-medium">{user.name}</span>
              <span className="ml-2 px-2 py-1 bg-gray-100 text-xs rounded-full">
                {user.role}
              </span>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}