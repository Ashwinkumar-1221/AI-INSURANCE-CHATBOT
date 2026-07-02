import { useMemo, useState } from 'react'

const nameFromEmail = (value: string) => {
  const localPart = value.trim().split('@')[0] || 'User'
  return localPart.replace(/[._-]/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())
}
import { Eye, EyeOff, Lock, Mail,ShieldCheck } from 'lucide-react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import AuthLayout from '../components/ui/AuthLayout'
import FormField from '../components/ui/FormField'

const initialErrors = {
  email: '',
  password: '',
}

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(true)
  const [visible, setVisible] = useState(false)
  const [errors, setErrors] = useState(initialErrors)
  const [submitError, setSubmitError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  const emailError = useMemo(() => {
    if (!email.trim()) return 'Email is required.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Enter a valid email address.'
    return ''
  }, [email])

  const passwordError = useMemo(() => {
    if (!password.trim()) return 'Password is required.'
    if (password.length < 8) return 'Password must be at least 8 characters.'
    return ''
  }, [password])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const validationErrors = {
      email: emailError,
      password: passwordError,
    }
    setErrors(validationErrors)
    setSubmitError('')
    if (validationErrors.email || validationErrors.password) return

    setSubmitting(true)

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || 'Unable to sign in right now.')  
      }

      const accessToken = data.access_token || data.token || ''
      const userProfile = {
        name: nameFromEmail(email),
        fullName: nameFromEmail(email),
        email,
        phone: '',
        address: '',
        preferences: '',
        language: 'English',
      }

      localStorage.setItem('token', accessToken)
      localStorage.setItem('access_token', accessToken)
      localStorage.setItem('authUser', JSON.stringify(userProfile))
      localStorage.setItem('user', JSON.stringify(userProfile))
      localStorage.setItem('currentUser', JSON.stringify(userProfile))
      localStorage.setItem('profile', JSON.stringify(userProfile))

      navigate('/dashboard')
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Unable to sign in right now.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout title="Login" actionLink={{ href: '/register', label: "Don't have an account?" }}>
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
        className="space-y-6"
        aria-label="Login form"
      >
        <FormField
          id="login-email"
          label="Email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          error={errors.email || emailError}
          placeholder="name@company.com"
          icon={<Mail className="h-5 w-5" />}
        />

        <FormField
          id="login-password"
          label="Password"
          type={visible ? 'text' : 'password'}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          error={errors.password || passwordError}
          placeholder="Enter your password"
          icon={<Lock className="h-5 w-5" />}
          suffix={
            <button
              type="button"
              onClick={() => setVisible((value) => !value)}
              className="text-slate-400 transition hover:text-slate-100"
            >
              {visible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          }
        />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <label className="inline-flex items-center gap-3 text-sm text-slate-300">
            <input
              type="checkbox"
              checked={remember}
              onChange={(event) => setRemember(event.target.checked)}
              className="h-4 w-4 rounded border-white/10 bg-slate-900 text-sky-500 accent-sky-500"
            />
            Remember Me
          </label>
          <a href="mailto:hello@aiinsurance.com" className="text-sm font-medium text-sky-300 hover:text-white">
            Forgot Password?
          </a>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-sky-500 to-violet-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/25 transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? 'Logging in...' : 'Login'}
        </button>

        {submitError ? (
          <p className="text-sm text-rose-300">{submitError}</p>
        ) : null}

        <div className="relative py-4">
          <div className="absolute inset-x-0 top-1/2 h-px bg-white/10" />
          <div className="relative mx-auto w-fit rounded-full bg-slate-950 px-4 text-sm text-slate-400">Continue with Google</div>
        </div>

        <button
          type="button"
          onClick={() => navigate('/dashboard')}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-slate-950/70 px-6 py-3 text-sm font-semibold text-slate-100 transition hover:border-sky-500/20 hover:bg-slate-900/80"
        >
          <ShieldCheck className="h-5 w-5 text-slate-100" />
          Continue with Google
        </button>
      </motion.form>
    </AuthLayout>
  )
}
