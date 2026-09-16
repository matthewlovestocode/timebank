import { useEffect, useState } from 'react'

export type AuthUser = {
  id: string
  name: string
  email: string
  createdAt: string
  updatedAt: string
  joinedAt: string
  role: 'member' | 'admin'
  bio: string
  location: string
}

export type SignUpInput = {
  name: string
  email: string
  password: string
  role: AuthUser['role']
}

export type SignInInput = {
  email: string
  password: string
}

export type ProfileInput = {
  name: string
  bio: string
  location: string
}

export function useDemoAuth(apiUrl: string) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [status, setStatus] = useState('Not signed in')

  useEffect(() => {
    const token = localStorage.getItem('timebank.authToken')
    if (!token) return

    fetch(`${apiUrl}/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then((response) => {
        if (!response.ok) throw new Error('Session expired')
        return response.json() as Promise<{ user: AuthUser }>
      })
      .then(({ user }) => {
        setUser(user)
        setStatus(`Signed in as ${user.name}`)
      })
      .catch(() => localStorage.removeItem('timebank.authToken'))
  }, [apiUrl])

  const signIn = async (input: SignInInput) => {
    setStatus('Signing in…')

    try {
      const response = await fetch(`${apiUrl}/auth/sign-in`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      })
      if (!response.ok) throw new Error('Could not sign in')

      const session = (await response.json()) as { token: string; user: AuthUser }
      localStorage.setItem('timebank.authToken', session.token)
      setUser(session.user)
      setStatus(`Signed in as ${session.user.name}`)
      return true
    } catch {
      setStatus('Sign-in failed')
      return false
    }
  }

  const signOut = async () => {
    const token = localStorage.getItem('timebank.authToken')

    if (token) {
      await fetch(`${apiUrl}/auth/sign-out`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => undefined)
    }

    localStorage.removeItem('timebank.authToken')
    setUser(null)
    setStatus('Not signed in')
  }

  const signUp = async (input: SignUpInput) => {
    setStatus('Creating account…')

    try {
      const response = await fetch(`${apiUrl}/auth/sign-up`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      })
      if (!response.ok) throw new Error('Could not create account')

      const session = (await response.json()) as { token: string; user: AuthUser }
      localStorage.setItem('timebank.authToken', session.token)
      setUser(session.user)
      setStatus(`Signed in as ${session.user.name}`)
      return true
    } catch {
      setStatus('Account creation failed')
      return false
    }
  }

  const updateProfile = async (input: ProfileInput) => {
    const token = localStorage.getItem('timebank.authToken')
    if (!token) {
      setStatus('Please sign in to update your profile')
      return false
    }
    setStatus('Saving profile…')
    try {
      const response = await fetch(`${apiUrl}/auth/me`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      })
      if (!response.ok) throw new Error('Could not save profile')
      const { user: updatedUser } = (await response.json()) as { user: AuthUser }
      setUser(updatedUser)
      setStatus('Profile saved')
      return true
    } catch {
      setStatus('Could not save profile')
      return false
    }
  }

  return { signIn, signOut, signUp, updateProfile, status, user }
}
