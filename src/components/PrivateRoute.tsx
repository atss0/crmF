import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import React from 'react'

export default function PrivateRoute({ children }: { children: React.ReactNode }) {
    const { user, isLoading } = useAuth()

    if (isLoading) {
        return <div className="text-center mt-10">Yükleniyor...</div>
      }

    if (!user) {
        return <Navigate to="/login" />
    }

    return children
}