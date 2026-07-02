import { useMemo, useState } from 'react'
import { Eye, EyeOff, Mail, Lock, Phone, User,ShieldCheck } from 'lucide-react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import AuthLayout from '../components/ui/AuthLayout'
import FormField from '../components/ui/FormField'

const initialErrors = {
  name: '',
  email: '',
  phone: '',
  password: '',
  confirm: '',
}

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [visible, setVisible] = useState(false)
  const [errors, setErrors] = useState(initialErrors)
  const [submitError, setSubmitError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  const nameError = useMemo(() => (!name.trim() ? 'Full name is required.' : ''), [name])
  const emailError = useMemo(() => {
    if (!email.trim()) return 'Email is required.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Enter a valid email address.'
    return ''
  }, [email])
  const phoneError = useMemo(() => {
    if (!phone.trim()) return 'Phone number is required.'
    if (!/^\+?\d{7,15}$/.test(phone)) return 'Enter a valid phone number.'
    return ''
  }, [phone])
  const passwordError = useMemo(() => {
    if (!password.trim()) return 'Password is required.'
    if (password.length < 8) return 'Password must be at least 8 characters.'
    return ''
  }, [password])
  const confirmError = useMemo(() => {
    if (!confirm.trim()) return 'Confirm password is required.'
    if (confirm !== password) return 'Passwords do not match.'
    return ''
  }, [confirm, password])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const validationErrors = {
      name: nameError,
      email: emailError,
      phone: phoneError,
      password: passwordError,
      confirm: confirmError,
    }
    setErrors(validationErrors)
    setSubmitError('')
    if (Object.values(validationErrors).some(Boolean)) return

    setSubmitting(true)

    try {
      const registerResponse = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ full_name: name, email, phone_number: phone, password, role: 'user' }),
      })

      const registerData = await registerResponse.json()

      if (!registerResponse.ok) {
        throw new Error(registerData.detail || 'Unable to create account right now.')
      }

      const loginResponse = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const loginData = await loginResponse.json()

      if (!loginResponse.ok) {
        throw new Error(loginData.detail || 'Unable to sign in right now.')
      }

      const accessToken = loginData.access_token || loginData.token || ''
      const userProfile = {
        name: registerData.full_name || name,
        fullName: registerData.full_name || name,
        email: registerData.email || email,
        phone: registerData.phone_number || phone,
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
      setSubmitError(error instanceof Error ? error.message : 'Unable to create account right now.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout title="Register" actionLink={{ href: '/login', label: 'Already have an account?' }}>
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
        className="space-y-6"
        aria-label="Registration form"
      >
        <FormField
          id="register-name"
          label="Full Name"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          error={errors.name || nameError}
          placeholder="Jane Doe"
          icon={<User className="h-5 w-5" />}
        />

        <FormField
          id="register-email"
          label="Email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          error={errors.email || emailError}
          placeholder="name@company.com"
          icon={<Mail className="h-5 w-5" />}
        />

        <FormField
          id="register-phone"
          label="Phone Number"
          type="tel"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          error={errors.phone || phoneError}
          placeholder="+1 555 012 3456"
          icon={<Phone className="h-5 w-5" />}
        />

        <FormField
          id="register-password"
          label="Password"
          type={visible ? 'text' : 'password'}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          error={errors.password || passwordError}
          placeholder="Create a password"
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

        <FormField
          id="register-confirm"
          label="Confirm Password"
          type={visible ? 'text' : 'password'}
          value={confirm}
          onChange={(event) => setConfirm(event.target.value)}
          error={errors.confirm || confirmError}
          placeholder="Repeat password"
          icon={<Lock className="h-5 w-5" />}
        />

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-sky-500 to-violet-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/25 transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? 'Creating account...' : 'Create Account'}
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
