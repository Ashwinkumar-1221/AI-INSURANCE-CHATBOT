import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  CheckCircle2,
  KeyRound,
  Laptop,
  Lock,
  MoonStar,
  ShieldCheck,
  Sparkles,
  SunMedium,
  Volume2,
} from 'lucide-react'
import DashboardSidebar from '../components/ui/DashboardSidebar'
import DashboardTopbar from '../components/ui/DashboardTopbar'

const initialSettings = {
  theme: 'Dark',
  language: 'English',
  emailAlerts: true,
  smsAlerts: true,
  aiVoice: true,
  preferredVoice: 'Aria',
  responseLanguage: 'English',
  password: '********',
  twoFactor: true,
}

const devices = [
  { name: 'MacBook Pro', location: 'Bengaluru, IN', lastSeen: 'Active now' },
  { name: 'iPhone 15', location: 'Hyderabad, IN', lastSeen: '12 min ago' },
]

export default function SettingsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [settings, setSettings] = useState(() => {
  const saved = localStorage.getItem("app-settings")
  return saved ? JSON.parse(saved) : initialSettings
})
  const navigate = useNavigate()
  const saveSettings = () => {
  localStorage.setItem("app-settings", JSON.stringify(settings))
  localStorage.setItem("theme", settings.theme.toLowerCase())

  if (settings.theme === "Light") {
    document.documentElement.classList.remove("dark")
  } else {
    document.documentElement.classList.add("dark")
  }

  navigate("/dashboard")
}

 const updateSetting = (
  field: keyof typeof initialSettings,
  value: string | boolean
) => {
  setSettings((current: typeof initialSettings) => ({
    ...current,
    [field]: value,
  }))
}

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <DashboardSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 lg:ml-80">
        <main className="w-full px-4 pb-8 pt-4 sm:px-6 lg:px-8 lg:pb-10 lg:pt-6">
          <DashboardTopbar onMenuClick={() => setSidebarOpen(true)} />

          <div className="mt-6 rounded-[32px] border border-white/10 bg-slate-950/80 p-4 shadow-2xl shadow-slate-950/30 backdrop-blur-2xl sm:p-6 lg:p-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/20 bg-sky-500/10 px-3 py-1 text-sm text-sky-200">
                  <Sparkles className="h-4 w-4" />
                  Account settings
                </div>
                <h1 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">Configure your workspace</h1>
                <p className="mt-3 text-sm leading-7 text-slate-300 sm:text-base">
                  Manage appearance, privacy, AI assistant behavior, and device access with a premium control center experience.
                </p>
              </div>

              <button type="button" onClick={saveSettings} className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-sky-500 to-violet-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:brightness-110">
                <CheckCircle2 className="h-4 w-4" />
                Save Settings
              </button>
            </div>

            <div className="mt-8 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
              <div className="space-y-6">
                <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-[28px] border border-white/10 bg-slate-900/80 p-5 shadow-inner shadow-slate-950/20">
                  <p className="text-sm font-semibold text-white">Account Preferences</p>
                  <div className="mt-5 grid gap-4 md:grid-cols-2">
                    <div className="rounded-[22px] border border-white/10 bg-slate-950/70 p-4 text-sm text-slate-300">
                      <span className="mb-2 block text-slate-400">Theme</span>
                      <div className="flex items-center gap-3">
                        <button type="button" onClick={() => updateSetting('theme', 'Dark')} className={`flex items-center gap-2 rounded-full px-3 py-2 ${settings.theme === 'Dark' ? 'bg-sky-500/15 text-sky-200' : 'bg-white/5 text-slate-300'}`}>
                          <MoonStar className="h-4 w-4" />
                          Dark
                        </button>
                        <button type="button" onClick={() => updateSetting('theme', 'Light')} className={`flex items-center gap-2 rounded-full px-3 py-2 ${settings.theme === 'Light' ? 'bg-sky-500/15 text-sky-200' : 'bg-white/5 text-slate-300'}`}>
                          <SunMedium className="h-4 w-4" />
                          Light
                        </button>
                      </div>
                    </div>

                    <div className="rounded-[22px] border border-white/10 bg-slate-950/70 p-4 text-sm text-slate-300">
                      <span className="mb-2 block text-slate-400">Language</span>
                      <select value={settings.language} onChange={(event) => updateSetting('language', event.target.value)} className="w-full bg-transparent text-white outline-none">
                        <option value="English" className="bg-slate-900">English</option>
                        <option value="Hindi" className="bg-slate-900">Hindi</option>
                        <option value="Telugu" className="bg-slate-900">Telugu</option>
                      </select>
                    </div>
                  </div>
                </motion.section>

                <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="rounded-[28px] border border-white/10 bg-slate-900/80 p-5 shadow-inner shadow-slate-950/20">
                  <p className="text-sm font-semibold text-white">Notification Settings</p>
                  <div className="mt-4 space-y-3">
                    {[
                      ['Email alerts', 'emailAlerts'],
                      ['SMS alerts', 'smsAlerts'],
                    ].map(([label, field]) => (
                      <label key={label} className="flex items-center justify-between rounded-[22px] border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-slate-300">
                        <span>{label}</span>
                        <input type="checkbox" checked={Boolean(settings[field as keyof typeof initialSettings])} onChange={(event) => updateSetting(field as keyof typeof initialSettings, event.target.checked)} className="h-4 w-4 rounded border-white/10 bg-transparent text-sky-500" />
                      </label>
                    ))}
                  </div>
                </motion.section>

                <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="rounded-[28px] border border-white/10 bg-slate-900/80 p-5 shadow-inner shadow-slate-950/20">
                  <p className="text-sm font-semibold text-white">Privacy & Security</p>
                  <div className="mt-4 space-y-3">
                    <div className="rounded-[22px] border border-white/10 bg-slate-950/70 p-4 text-sm text-slate-300">
                      <div className="flex items-center justify-between gap-2">
                        <span>Two-Factor Authentication</span>
                        <input type="checkbox" checked={Boolean(settings.twoFactor)} onChange={(event) => updateSetting('twoFactor', event.target.checked)} className="h-4 w-4 rounded border-white/10 bg-transparent text-sky-500" />
                      </div>
                    </div>
                    <div className="rounded-[22px] border border-white/10 bg-slate-950/70 p-4 text-sm text-slate-300">
                      <div className="flex items-center gap-2 text-white">
                        <Lock className="h-4 w-4 text-sky-300" />
                        Password policy
                      </div>
                      <p className="mt-2 text-slate-400">Use at least 8 characters and include a number or symbol.</p>
                    </div>
                  </div>
                </motion.section>

                <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-[28px] border border-white/10 bg-slate-900/80 p-5 shadow-inner shadow-slate-950/20">
                  <p className="text-sm font-semibold text-white">Password Change</p>
                  <div className="mt-4 space-y-3">
                    <label className="block rounded-[22px] border border-white/10 bg-slate-950/70 p-4 text-sm text-slate-300">
                      <span className="mb-2 block text-slate-400">Current password</span>
                      <div className="flex items-center gap-2">
                        <KeyRound className="h-4 w-4 text-slate-400" />
                        <input type="password" value={settings.password} onChange={(event) => updateSetting('password', event.target.value)} className="w-full bg-transparent text-white outline-none" />
                      </div>
                    </label>
                    <label className="block rounded-[22px] border border-white/10 bg-slate-950/70 p-4 text-sm text-slate-300">
                      <span className="mb-2 block text-slate-400">New password</span>
                      <div className="flex items-center gap-2">
                        <KeyRound className="h-4 w-4 text-slate-400" />
                        <input type="password" placeholder="Enter a new password" className="w-full bg-transparent text-white outline-none placeholder:text-slate-500" />
                      </div>
                    </label>
                  </div>
                </motion.section>
              </div>

              <div className="space-y-6">
                <motion.section initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} className="rounded-[28px] border border-white/10 bg-slate-900/80 p-5 shadow-inner shadow-slate-950/20">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500/20 to-violet-500/20 text-sky-300">
                      <Volume2 className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">AI Assistant Preferences</p>
                      <p className="text-sm text-slate-400">Voice and language controls</p>
                    </div>
                  </div>
                  <div className="mt-4 space-y-4">
                    <label className="flex items-center justify-between rounded-[22px] border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-slate-300">
                      <span>Voice on</span>
                      <input type="checkbox" checked={Boolean(settings.aiVoice)} onChange={(event) => updateSetting('aiVoice', event.target.checked)} className="h-4 w-4 rounded border-white/10 bg-transparent text-sky-500" />
                    </label>
                    <label className="block rounded-[22px] border border-white/10 bg-slate-950/70 p-4 text-sm text-slate-300">
                      <span className="mb-2 block text-slate-400">Preferred voice</span>
                      <select value={settings.preferredVoice} onChange={(event) => updateSetting('preferredVoice', event.target.value)} className="w-full bg-transparent text-white outline-none">
                        <option value="Aria" className="bg-slate-900">Aria</option>
                        <option value="Nova" className="bg-slate-900">Nova</option>
                        <option value="Echo" className="bg-slate-900">Echo</option>
                      </select>
                    </label>
                    <label className="block rounded-[22px] border border-white/10 bg-slate-950/70 p-4 text-sm text-slate-300">
                      <span className="mb-2 block text-slate-400">Response language</span>
                      <select value={settings.responseLanguage} onChange={(event) => updateSetting('responseLanguage', event.target.value)} className="w-full bg-transparent text-white outline-none">
                        <option value="English" className="bg-slate-900">English</option>
                        <option value="Hindi" className="bg-slate-900">Hindi</option>
                        <option value="Telugu" className="bg-slate-900">Telugu</option>
                      </select>
                    </label>
                  </div>
                </motion.section>

                <motion.section initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 }} className="rounded-[28px] border border-white/10 bg-slate-900/80 p-5 shadow-inner shadow-slate-950/20">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500/20 to-violet-500/20 text-sky-300">
                      <Laptop className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">Connected devices</p>
                      <p className="text-sm text-slate-400">Recent signed-in devices</p>
                    </div>
                  </div>
                  <div className="mt-4 space-y-3">
                    {devices.map((device) => (
                      <div key={device.name} className="rounded-[22px] border border-white/10 bg-slate-950/70 p-4 text-sm text-slate-300">
                        <div className="flex items-center justify-between gap-3">
                          <p className="font-semibold text-white">{device.name}</p>
                          <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">{device.lastSeen}</span>
                        </div>
                        <p className="mt-2 text-slate-400">{device.location}</p>
                      </div>
                    ))}
                  </div>
                </motion.section>

                <motion.section initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.08 }} className="rounded-[28px] border border-white/10 bg-gradient-to-br from-slate-900/90 to-slate-950/90 p-5 shadow-inner shadow-slate-950/20">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/20 to-sky-500/20 text-violet-200">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">Security note</p>
                      <p className="text-sm text-slate-400">Recommended actions</p>
                    </div>
                  </div>
                  <div className="mt-4 rounded-[24px] border border-white/10 bg-slate-900/70 p-4 text-sm leading-7 text-slate-300">
                    Keep your password updated regularly and review connected devices to maintain a safe account environment.
                  </div>
                </motion.section>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
