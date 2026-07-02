import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  BadgeCheck,
  BellRing,
  Camera,
  FileText,
  Lock,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
  UserCircle2,
} from 'lucide-react'
import DashboardSidebar from '../components/ui/DashboardSidebar'
import DashboardTopbar from '../components/ui/DashboardTopbar'

type ProfileState = {
  name: string
  email: string
  phone: string
  address: string
  preferences: string
  language: string
}

const PROFILE_STORAGE_KEY = 'ai-insurance-profile'
const PROFILE_UPDATED_EVENT = 'ai-insurance-profile-updated'
const PROFILE_API_CANDIDATES = ['/api/profile/me', '/profile/me', '/api/auth/me', '/auth/me', '/api/users/me', '/users/me']

const createEmptyProfile = (): ProfileState => ({
  name: '',
  email: '',
  phone: '',
  address: '',
  preferences: '',
  language: 'English',
})

const readStoredProfile = (): ProfileState => {
  if (typeof window === 'undefined') return createEmptyProfile()

  try {
    const storedValue = window.localStorage.getItem(PROFILE_STORAGE_KEY)
    if (storedValue) {
      const parsed = JSON.parse(storedValue) as Partial<ProfileState>
      return { ...createEmptyProfile(), ...parsed }
    }
  } catch {
    // ignore storage parse errors and fall back to other sources
  }

  const authKeys = ['authUser', 'user', 'currentUser', 'profile']
  for (const key of authKeys) {
    const rawValue = window.localStorage.getItem(key)
    if (!rawValue) continue

    try {
      const parsed = JSON.parse(rawValue)
      const resolvedName = parsed?.name || parsed?.fullName || parsed?.full_name || ''
      const resolvedEmail = parsed?.email || ''
      const resolvedPhone = parsed?.phone || parsed?.mobile || ''
      const resolvedAddress = parsed?.address || ''
      const resolvedLanguage = parsed?.language || 'English'
      const nextProfile = createEmptyProfile()
      nextProfile.name = resolvedName
      nextProfile.email = resolvedEmail
      nextProfile.phone = resolvedPhone
      nextProfile.address = resolvedAddress
      nextProfile.language = resolvedLanguage
      if (nextProfile.name || nextProfile.email) {
        return nextProfile
      }
    } catch {
      // ignore malformed auth payloads
    }
  }

  return createEmptyProfile()
}

const persistProfile = (profile: ProfileState) => {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile))
  window.dispatchEvent(new Event(PROFILE_UPDATED_EVENT))
}

const fetchProfileFromApi = async (): Promise<ProfileState | null> => {
  if (typeof window === 'undefined') return null

  const token = window.localStorage.getItem('token') || window.localStorage.getItem('access_token') || window.localStorage.getItem('authToken')
  if (!token) return null

  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  }

  for (const endpoint of PROFILE_API_CANDIDATES) {
    try {
      const response = await fetch(endpoint, { headers })
      if (!response.ok) continue

      const payload = await response.json()
      const source = payload?.profile || payload?.user || payload
      if (!source) continue

      const nextProfile = createEmptyProfile()
      nextProfile.name = source.name || source.fullName || source.full_name || ''
      nextProfile.email = source.email || ''
      nextProfile.phone = source.phone || source.mobile || ''
      nextProfile.address = source.address || ''
      nextProfile.preferences = source.preferences || source.coveragePreference || ''
      nextProfile.language = source.language || 'English'

      if (nextProfile.name || nextProfile.email) {
        return nextProfile
      }
    } catch {
      // try the next candidate endpoint
    }
  }

  return null
}

const linkedPolicies = [
  { name: 'Aurelia Health Shield', type: 'Health', status: 'Active' },
  { name: 'DriveShield Plus', type: 'Vehicle', status: 'Active' },
  { name: 'Harbor Home Secure', type: 'Home', status: 'Pending Renewal' },
]

const documents = ['KYC Verification.pdf', 'Policy Copy.pdf', 'Claim Support Form.pdf']

const activity = [
  { title: 'Profile updated', detail: 'Personal details and address were refreshed.', time: '2 hours ago' },
  { title: 'Policy preference saved', detail: 'Health and family coverage preference updated.', time: 'Yesterday' },
  { title: 'Document uploaded', detail: 'KYC verification document was attached.', time: '2 days ago' },
]

export default function ProfilePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [profile, setProfile] = useState<ProfileState>(() => readStoredProfile())
  const navigate = useNavigate()

  useEffect(() => {
    let isMounted = true

    const hydrateProfile = async () => {
      const storedProfile = readStoredProfile()
      if (storedProfile.name || storedProfile.email || storedProfile.phone || storedProfile.address || storedProfile.preferences) {
        setProfile(storedProfile)
      }

      const apiProfile = await fetchProfileFromApi()
      if (!isMounted || !apiProfile) return

      const mergedProfile = { ...createEmptyProfile(), ...storedProfile, ...apiProfile }
      setProfile(mergedProfile)
      persistProfile(mergedProfile)
    }

    const handleProfileUpdated = () => {
      const nextProfile = readStoredProfile()
      setProfile(nextProfile)
    }

    hydrateProfile()
    window.addEventListener(PROFILE_UPDATED_EVENT, handleProfileUpdated)

    return () => {
      isMounted = false
      window.removeEventListener(PROFILE_UPDATED_EVENT, handleProfileUpdated)
    }
  }, [])

  const updateField = (field: keyof ProfileState, value: string) => {
    setProfile((current) => {
      const nextProfile = { ...current, [field]: value }
      persistProfile(nextProfile)
      return nextProfile
    })
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <DashboardSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 lg:ml-80">
        <main className="w-full px-4 pb-8 pt-4 sm:px-6 lg:px-8 lg:pb-10 lg:pt-6">
          <DashboardTopbar onMenuClick={() => setSidebarOpen(true)} />

          <div className="mt-6 rounded-[32px] border border-white/10 bg-slate-950/80 p-4 shadow-2xl shadow-slate-950/30 backdrop-blur-2xl sm:p-6 lg:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/20 bg-sky-500/10 px-3 py-1 text-sm text-sky-200">
                  <Sparkles className="h-4 w-4" />
                  Profile management
                </div>
                <h1 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">Your account profile</h1>
                <p className="mt-3 text-sm leading-7 text-slate-300 sm:text-base">
                  Keep your personal details, insurance preferences, and security settings up to date in one secure workspace.
                </p>
              </div>

              <button type="button" onClick={() => navigate('/dashboard')} className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-sky-500 to-violet-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:brightness-110">
                <BadgeCheck className="h-4 w-4" />
                Save Changes
              </button>
            </div>

            <div className="mt-8 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
              <div className="space-y-6">
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-[28px] border border-white/10 bg-slate-900/80 p-5 shadow-inner shadow-slate-950/20">
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                    <div className="relative">
                      <input id="profile-photo-input" type="file" accept="image/*" className="hidden" onChange={() => undefined} />
                      <div className="flex h-24 w-24 items-center justify-center rounded-full border border-sky-400/20 bg-gradient-to-br from-sky-500/20 to-violet-500/20 text-sky-200">
                        <UserCircle2 className="h-16 w-16" />
                      </div>
                      <button type="button" onClick={() => document.getElementById('profile-photo-input')?.click()} className="absolute bottom-0 right-0 rounded-full border border-white/10 bg-slate-950/90 p-2 text-slate-200">
                        <Camera className="h-4 w-4" />
                      </button>
                    </div>
                    <div>
                      <p className="text-xl font-semibold text-white">{profile.name || 'Your profile'}</p>
                      <p className="mt-2 text-sm text-slate-400">Premium account • Verified profile</p>
                      <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-sm text-emerald-200">
                        <ShieldCheck className="h-4 w-4" />
                        Secure and active
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-4 md:grid-cols-2">
                    <label className="rounded-[22px] border border-white/10 bg-slate-950/70 p-4 text-sm text-slate-300">
                      <span className="mb-2 block text-slate-400">Full Name</span>
                      <input value={profile.name} onChange={(event) => updateField('name', event.target.value)} className="w-full bg-transparent text-white outline-none" />
                    </label>
                    <label className="rounded-[22px] border border-white/10 bg-slate-950/70 p-4 text-sm text-slate-300">
                      <span className="mb-2 block text-slate-400">Email Address</span>
                      <input value={profile.email} onChange={(event) => updateField('email', event.target.value)} className="w-full bg-transparent text-white outline-none" />
                    </label>
                    <label className="rounded-[22px] border border-white/10 bg-slate-950/70 p-4 text-sm text-slate-300">
                      <span className="mb-2 block text-slate-400">Phone Number</span>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-slate-400" />
                        <input value={profile.phone} onChange={(event) => updateField('phone', event.target.value)} className="w-full bg-transparent text-white outline-none" />
                      </div>
                    </label>
                    <label className="rounded-[22px] border border-white/10 bg-slate-950/70 p-4 text-sm text-slate-300">
                      <span className="mb-2 block text-slate-400">Preferred Language</span>
                      <select value={profile.language} onChange={(event) => updateField('language', event.target.value)} className="w-full bg-transparent text-white outline-none">
                        <option value="English" className="bg-slate-900">English</option>
                        <option value="Hindi" className="bg-slate-900">Hindi</option>
                        <option value="Telugu" className="bg-slate-900">Telugu</option>
                      </select>
                    </label>
                  </div>

                  <label className="mt-4 block rounded-[22px] border border-white/10 bg-slate-950/70 p-4 text-sm text-slate-300">
                    <span className="mb-2 block text-slate-400">Address</span>
                    <div className="flex items-start gap-2">
                      <MapPin className="mt-1 h-4 w-4 text-slate-400" />
                      <input value={profile.address} onChange={(event) => updateField('address', event.target.value)} className="w-full bg-transparent text-white outline-none" />
                    </div>
                  </label>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="rounded-[28px] border border-white/10 bg-slate-900/80 p-5 shadow-inner shadow-slate-950/20">
                  <p className="text-sm font-semibold text-white">Insurance preferences</p>
                  <div className="mt-4 rounded-[22px] border border-white/10 bg-slate-950/70 p-4 text-sm text-slate-300">
                    <span className="mb-2 block text-slate-400">Primary focus</span>
                    <input value={profile.preferences} onChange={(event) => updateField('preferences', event.target.value)} className="w-full bg-transparent text-white outline-none" />
                  </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="rounded-[28px] border border-white/10 bg-slate-900/80 p-5 shadow-inner shadow-slate-950/20">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-white">Uploaded documents</p>
                      <p className="mt-1 text-sm text-slate-400">Securely stored files</p>
                    </div>
                    <button type="button" onClick={() => document.getElementById('profile-doc-input')?.click()} className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-slate-200 transition hover:border-sky-400/20 hover:text-white">
                      Add File
                    </button>
                  </div>
                  <div className="mt-4 space-y-3">
                    {documents.map((document) => (
                      <div key={document} className="flex items-center justify-between rounded-[22px] border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-slate-300">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-sky-300" />
                          {document}
                        </div>
                        <span className="text-xs uppercase tracking-[0.24em] text-slate-500">Ready</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>

              <div className="space-y-6">
                <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} className="rounded-[28px] border border-white/10 bg-slate-900/80 p-5 shadow-inner shadow-slate-950/20">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500/20 to-violet-500/20 text-sky-300">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">Linked policies</p>
                      <p className="text-sm text-slate-400">Your active coverages</p>
                    </div>
                  </div>
                  <div className="mt-4 space-y-3">
                    {linkedPolicies.map((policy) => (
                      <div key={policy.name} className="rounded-[22px] border border-white/10 bg-slate-950/70 p-4 text-sm text-slate-300">
                        <div className="flex items-center justify-between gap-3">
                          <p className="font-semibold text-white">{policy.name}</p>
                          <span className="rounded-full bg-sky-500/10 px-3 py-1 text-xs font-semibold text-sky-200">{policy.status}</span>
                        </div>
                        <p className="mt-2 text-slate-400">{policy.type} policy</p>
                      </div>
                    ))}
                  </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 }} className="rounded-[28px] border border-white/10 bg-slate-900/80 p-5 shadow-inner shadow-slate-950/20">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/20 to-sky-500/20 text-violet-200">
                      <Lock className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">Account security</p>
                      <p className="text-sm text-slate-400">Protection status</p>
                    </div>
                  </div>
                  <div className="mt-4 rounded-[24px] border border-white/10 bg-slate-950/70 p-4 text-sm leading-7 text-slate-300">
                    Two-factor authentication is enabled. Your account uses biometric sign-in and encrypted data storage.
                  </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.08 }} className="rounded-[28px] border border-white/10 bg-slate-900/80 p-5 shadow-inner shadow-slate-950/20">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500/20 to-violet-500/20 text-sky-300">
                      <BellRing className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">Recent activity</p>
                      <p className="text-sm text-slate-400">Latest account actions</p>
                    </div>
                  </div>
                  <div className="mt-4 space-y-3">
                    {activity.map((item) => (
                      <div key={item.title} className="rounded-[22px] border border-white/10 bg-slate-950/70 p-4 text-sm text-slate-300">
                        <p className="font-semibold text-white">{item.title}</p>
                        <p className="mt-2 leading-6 text-slate-400">{item.detail}</p>
                        <p className="mt-3 text-xs uppercase tracking-[0.24em] text-slate-500">{item.time}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
