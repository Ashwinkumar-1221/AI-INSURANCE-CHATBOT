import { useEffect, useState } from 'react'
import { Bell, Globe, Search, Menu, UserCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

type ProfileSummary = {
  name: string
  email: string
  phone: string
  address: string
  preferences: string
  language: string
}

const PROFILE_STORAGE_KEY = 'ai-insurance-profile'
const PROFILE_UPDATED_EVENT = 'ai-insurance-profile-updated'

const createEmptyProfile = (): ProfileSummary => ({
  name: '',
  email: '',
  phone: '',
  address: '',
  preferences: '',
  language: 'English',
})

const readStoredProfile = (): ProfileSummary => {
  if (typeof window === 'undefined') return createEmptyProfile()

  try {
    const storedValue = window.localStorage.getItem(PROFILE_STORAGE_KEY)
    if (storedValue) {
      const parsed = JSON.parse(storedValue) as Partial<ProfileSummary>
      return { ...createEmptyProfile(), ...parsed }
    }
  } catch {
    // ignore and fall back to auth state
  }

  const authKeys = ['authUser', 'user', 'currentUser', 'profile']
  for (const key of authKeys) {
    const rawValue = window.localStorage.getItem(key)
    if (!rawValue) continue

    try {
      const parsed = JSON.parse(rawValue)
      const nextProfile = createEmptyProfile()
      nextProfile.name = parsed?.name || parsed?.fullName || parsed?.full_name || ''
      nextProfile.email = parsed?.email || ''
      nextProfile.phone = parsed?.phone || parsed?.mobile || ''
      nextProfile.address = parsed?.address || ''
      nextProfile.language = parsed?.language || 'English'
      if (nextProfile.name || nextProfile.email) {
        return nextProfile
      }
    } catch {
      // ignore malformed auth payloads
    }
  }

  return createEmptyProfile()
}

interface DashboardTopbarProps {
  onMenuClick: () => void
}

export default function DashboardTopbar({ onMenuClick }: DashboardTopbarProps) {
  const [language, setLanguage] = useState('English')
  const [search, setSearch] = useState("")
  const [profile, setProfile] = useState<ProfileSummary>(() => readStoredProfile())
  const navigate = useNavigate()

  useEffect(() => {
    const handleProfileUpdated = () => {
      setProfile(readStoredProfile())
    }

    handleProfileUpdated()
    window.addEventListener(PROFILE_UPDATED_EVENT, handleProfileUpdated)

    return () => {
      window.removeEventListener(PROFILE_UPDATED_EVENT, handleProfileUpdated)
    }
  }, [])

  return (
    <div className="flex items-center justify-between gap-4 rounded-[28px] border border-white/10 bg-slate-950/80 p-4 shadow-xl shadow-slate-950/20 backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <button type="button" className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-slate-900/80 text-slate-200 transition hover:bg-slate-900" onClick={onMenuClick}>
          <Menu className="h-5 w-5" />
        </button>
        <div className="hidden sm:block">
          <div className="relative w-[320px] min-w-[180px] overflow-hidden rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3 text-slate-300 shadow-inner shadow-slate-950/10">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
  type="search"
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  onKeyDown={(e) => {
    if (e.key !== "Enter") return

    const q = search.toLowerCase()

    if (q.includes("profile")) navigate("/profile")
    else if (q.includes("claim")) navigate("/claims")
    else if (q.includes("policy")) navigate("/policies")
    else if (q.includes("assistant") || q.includes("chat")) navigate("/assistant")
    else if (q.includes("settings")) navigate("/settings")
    else if (q.includes("dashboard")) navigate("/dashboard")
  }}
  placeholder="Search policies, claims, insights..."
  className="w-full bg-transparent pl-10 text-sm text-slate-200 outline-none placeholder:text-slate-500"
/>
          </div>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-end gap-4 sm:gap-5">
        <button type="button" onClick={() => navigate('/notifications')} className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-slate-900/80 text-slate-200 transition hover:bg-slate-900">
          <Bell className="h-5 w-5" />
        </button>
        <div className="inline-flex items-center gap-3 rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-slate-200 shadow-inner shadow-slate-950/10">
          <Globe className="h-4 w-4 text-slate-300" />
          <select
            value={language}
            onChange={(event) => setLanguage(event.target.value)}
            className="bg-transparent text-sm text-slate-100 outline-none"
          >
            <option>English</option>
            <option>Hindi</option>
            <option>Telugu</option>
          </select>
        </div>
        <button type="button" onClick={() => navigate('/profile')} className="inline-flex items-center gap-3 rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3 shadow-inner shadow-slate-950/10">
          <div className="relative">
            <UserCircle className="h-11 w-11 rounded-full text-sky-400" />
            <span className="absolute right-0 top-0 h-3.5 w-3.5 rounded-full border border-slate-950 bg-emerald-400 shadow-[0_0_0_4px_rgba(15,23,42,0.45)]" />
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-white">{profile.name || 'Your profile'}</p>
            <p className="text-xs text-slate-400">Online</p>
          </div>
        </button>
      </div>
    </div>
  )
}
