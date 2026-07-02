import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  BarChart3,
  HeartPulse,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
} from 'lucide-react'
import DashboardSidebar from '../components/ui/DashboardSidebar'
import DashboardTopbar from '../components/ui/DashboardTopbar'

interface FormState {
  age: string
  gender: string
  maritalStatus: string
  occupation: string
  annualIncome: string
  familyMembers: string
  existingInsurance: string
  insuranceType: string
  budgetRange: string
  medicalConditions: string
  habits: string
  coveragePriority: string
}

interface RecommendationCard {
  name: string
  suitabilityScore: string
  premium: string
  benefits: string[]
}

const initialFormState: FormState = {
  age: '32',
  gender: 'Female',
  maritalStatus: 'Married',
  occupation: 'Product Manager',
  annualIncome: '12-15 LPA',
  familyMembers: '3',
  existingInsurance: 'Health + Term',
  insuranceType: 'Health',
  budgetRange: '₹10k-₹20k/year',
  medicalConditions: 'No major conditions',
  habits: 'Non-smoker, occasional alcohol',
  coveragePriority: 'Balanced Protection',
}

const steps = [
  { title: 'Profile', description: 'Tell us about your personal situation.' },
  { title: 'Coverage', description: 'Choose the insurance type and budget.' },
  { title: 'Health', description: 'Share any health and lifestyle details.' },
  { title: 'Priority', description: 'Set your protection focus.' },
]

const genderOptions = ['Female', 'Male', 'Non-binary', 'Prefer not to say']
const maritalOptions = ['Single', 'Married', 'Divorced', 'Widowed']
const occupationOptions = ['Product Manager', 'Software Engineer', 'Doctor', 'Business Owner', 'Teacher', 'Other']
const incomeOptions = ['Below 5 LPA', '5-10 LPA', '10-15 LPA', '15-25 LPA', '25+ LPA']
const familyOptions = ['1', '2', '3', '4', '5+']
const insuranceTypeOptions = ['Health', 'Life', 'Vehicle', 'Travel', 'Home']
const budgetOptions = ['Below ₹5k/year', '₹5k-₹10k/year', '₹10k-₹20k/year', '₹20k-₹40k/year', '₹40k+/year']
const habitsOptions = ['Non-smoker, no alcohol', 'Non-smoker, occasional alcohol', 'Smoker, occasional alcohol', 'Prefer not to say']
const priorityOptions = ['Balanced Protection', 'Maximum Coverage', 'Budget Friendly', 'Tax Efficiency', 'Family Security']

function getRecommendations(form: FormState): RecommendationCard[] {
  const baseType = form.insuranceType
  const premiumBase = form.budgetRange.includes('₹40k') ? '₹34k' : form.budgetRange.includes('₹20k') ? '₹18k' : form.budgetRange.includes('₹10k') ? '₹12k' : '₹7k'

  if (baseType === 'Health') {
    return [
      {
        name: 'Aurelia Health Shield',
        suitabilityScore: '95%',
        premium: premiumBase,
        benefits: ['Cashless hospitals', 'Wellness rewards', 'Maternity cover'],
      },
      {
        name: 'Northstar Family Care',
        suitabilityScore: '91%',
        premium: '₹15k',
        benefits: ['Critical illness add-on', 'OPD benefits', 'Fast claims'],
      },
      {
        name: 'Nova Premium Health+',
        suitabilityScore: '88%',
        premium: '₹20k',
        benefits: ['Global coverage', 'Dedicated concierge', 'Annual health check'],
      },
    ]
  }

  if (baseType === 'Life') {
    return [
      {
        name: 'Everguard Life Secure',
        suitabilityScore: '94%',
        premium: '₹9k',
        benefits: ['High cover', 'Income protection', 'Flexible tenure'],
      },
      {
        name: 'Summit Term Advantage',
        suitabilityScore: '90%',
        premium: '₹7k',
        benefits: ['Tax-efficient', 'Critical illness rider', 'Simplified underwriting'],
      },
      {
        name: 'Lumen Family Protector',
        suitabilityScore: '87%',
        premium: '₹11k',
        benefits: ['Family payout', 'Waiver of premium', 'Digital claim support'],
      },
    ]
  }

  if (baseType === 'Vehicle') {
    return [
      {
        name: 'DriveShield Plus',
        suitabilityScore: '93%',
        premium: '₹16k',
        benefits: ['Zero depreciation', 'Roadside support', 'Engine protection'],
      },
      {
        name: 'Metro Auto Elite',
        suitabilityScore: '89%',
        premium: '₹12k',
        benefits: ['Personal accident cover', 'Key replacement', 'Quick claim service'],
      },
      {
        name: 'CityGuard Premium',
        suitabilityScore: '86%',
        premium: '₹14k',
        benefits: ['Garage cash', 'Own damage cover', 'No-claims bonus'],
      },
    ]
  }

  if (baseType === 'Travel') {
    return [
      {
        name: 'GlobeJet Travel Shield',
        suitabilityScore: '92%',
        premium: '₹6k',
        benefits: ['Medical evacuation', 'Trip delay cover', 'Baggage protection'],
      },
      {
        name: 'Voyager Premium',
        suitabilityScore: '88%',
        premium: '₹5k',
        benefits: ['Adventure sport cover', 'Flight cancellation', '24/7 assistance'],
      },
      {
        name: 'Atlas Travel Elite',
        suitabilityScore: '85%',
        premium: '₹7k',
        benefits: ['Multi-country plan', 'Loss of passport', 'Emergency support'],
      },
    ]
  }

  return [
    {
      name: 'Harbor Home Secure',
      suitabilityScore: '94%',
      premium: '₹13k',
      benefits: ['Structural protection', 'Burglary cover', 'Natural disaster add-on'],
    },
    {
      name: 'EstateGuard Plus',
      suitabilityScore: '90%',
      premium: '₹11k',
      benefits: ['Content coverage', 'Tenant protection', 'Flexible deductibles'],
    },
    {
      name: 'Residency Shield',
      suitabilityScore: '87%',
      premium: '₹9k',
      benefits: ['24/7 support', 'Water damage cover', 'Maintenance reimbursement'],
    },
  ]
}

export default function RecommendationPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [form, setForm] = useState<FormState>(initialFormState)
  const [step, setStep] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [selectedCompare, setSelectedCompare] = useState<string | null>(null)

  const recommendations = useMemo(() => getRecommendations(form), [form])

  const updateField = (field: keyof FormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep((current) => current + 1)
    }
  }

  const handlePrevious = () => {
    if (step > 0) {
      setStep((current) => current - 1)
    }
  }

  const handleGenerate = () => {
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <DashboardSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 lg:ml-80">
        <main className="w-full px-4 pb-8 pt-4 sm:px-6 lg:px-8 lg:pb-10 lg:pt-6">
          <DashboardTopbar onMenuClick={() => setSidebarOpen(true)} />

          <div className="mt-6 rounded-[32px] border border-white/10 bg-slate-950/80 p-4 shadow-2xl shadow-slate-950/30 backdrop-blur-2xl sm:p-6 lg:p-8">
            <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/20 bg-sky-500/10 px-3 py-1 text-sm text-sky-200">
                  <Sparkles className="h-4 w-4" />
                  AI-driven policy matching
                </div>
                <h1 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">Insurance Recommendation Studio</h1>
                <p className="mt-3 text-sm leading-7 text-slate-300 sm:text-base">
                  Share a few details and receive premium policy suggestions tailored to your household, budget, and coverage goals.
                </p>
              </div>

              <div className="rounded-[24px] border border-white/10 bg-slate-900/80 px-4 py-4 text-sm text-slate-300 shadow-inner shadow-slate-950/20">
                <div className="flex items-center gap-2 text-sky-200">
                  <BadgeCheck className="h-4 w-4" />
                  <span className="font-semibold text-white">Step {step + 1}</span>
                  <span>of {steps.length}</span>
                </div>
                <div className="mt-3 h-2 w-56 overflow-hidden rounded-full bg-slate-800">
                  <div className="h-full rounded-full bg-gradient-to-r from-sky-500 to-violet-500" style={{ width: `${((step + 1) / steps.length) * 100}%` }} />
                </div>
                <p className="mt-3 text-xs uppercase tracking-[0.24em] text-slate-400">{steps[step].title}</p>
              </div>
            </div>

            <div className="mt-8 grid gap-6 xl:grid-cols-[1.1fr_0.7fr]">
              <div className="rounded-[28px] border border-white/10 bg-slate-900/80 p-5 shadow-inner shadow-slate-950/20 sm:p-6">
                <div className="mb-6">
                  <p className="text-sm font-semibold text-white">{steps[step].title}</p>
                  <p className="mt-2 text-sm text-slate-400">{steps[step].description}</p>
                </div>

                {step === 0 ? (
                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="rounded-[22px] border border-white/10 bg-slate-950/70 p-4 text-sm text-slate-300">
                      <span className="mb-2 block text-slate-400">Age</span>
                      <input value={form.age} onChange={(event) => updateField('age', event.target.value)} className="w-full bg-transparent text-white outline-none" />
                    </label>
                    <label className="rounded-[22px] border border-white/10 bg-slate-950/70 p-4 text-sm text-slate-300">
                      <span className="mb-2 block text-slate-400">Gender</span>
                      <select value={form.gender} onChange={(event) => updateField('gender', event.target.value)} className="w-full bg-transparent text-white outline-none">
                        {genderOptions.map((option) => <option key={option} value={option} className="bg-slate-900">{option}</option>)}
                      </select>
                    </label>
                    <label className="rounded-[22px] border border-white/10 bg-slate-950/70 p-4 text-sm text-slate-300">
                      <span className="mb-2 block text-slate-400">Marital Status</span>
                      <select value={form.maritalStatus} onChange={(event) => updateField('maritalStatus', event.target.value)} className="w-full bg-transparent text-white outline-none">
                        {maritalOptions.map((option) => <option key={option} value={option} className="bg-slate-900">{option}</option>)}
                      </select>
                    </label>
                    <label className="rounded-[22px] border border-white/10 bg-slate-950/70 p-4 text-sm text-slate-300">
                      <span className="mb-2 block text-slate-400">Occupation</span>
                      <select value={form.occupation} onChange={(event) => updateField('occupation', event.target.value)} className="w-full bg-transparent text-white outline-none">
                        {occupationOptions.map((option) => <option key={option} value={option} className="bg-slate-900">{option}</option>)}
                      </select>
                    </label>
                  </div>
                ) : null}

                {step === 1 ? (
                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="rounded-[22px] border border-white/10 bg-slate-950/70 p-4 text-sm text-slate-300">
                      <span className="mb-2 block text-slate-400">Annual Income</span>
                      <select value={form.annualIncome} onChange={(event) => updateField('annualIncome', event.target.value)} className="w-full bg-transparent text-white outline-none">
                        {incomeOptions.map((option) => <option key={option} value={option} className="bg-slate-900">{option}</option>)}
                      </select>
                    </label>
                    <label className="rounded-[22px] border border-white/10 bg-slate-950/70 p-4 text-sm text-slate-300">
                      <span className="mb-2 block text-slate-400">Number of Family Members</span>
                      <select value={form.familyMembers} onChange={(event) => updateField('familyMembers', event.target.value)} className="w-full bg-transparent text-white outline-none">
                        {familyOptions.map((option) => <option key={option} value={option} className="bg-slate-900">{option}</option>)}
                      </select>
                    </label>
                    <label className="rounded-[22px] border border-white/10 bg-slate-950/70 p-4 text-sm text-slate-300">
                      <span className="mb-2 block text-slate-400">Existing Insurance</span>
                      <input value={form.existingInsurance} onChange={(event) => updateField('existingInsurance', event.target.value)} className="w-full bg-transparent text-white outline-none" />
                    </label>
                    <label className="rounded-[22px] border border-white/10 bg-slate-950/70 p-4 text-sm text-slate-300">
                      <span className="mb-2 block text-slate-400">Preferred Insurance Type</span>
                      <select value={form.insuranceType} onChange={(event) => updateField('insuranceType', event.target.value)} className="w-full bg-transparent text-white outline-none">
                        {insuranceTypeOptions.map((option) => <option key={option} value={option} className="bg-slate-900">{option}</option>)}
                      </select>
                    </label>
                  </div>
                ) : null}

                {step === 2 ? (
                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="rounded-[22px] border border-white/10 bg-slate-950/70 p-4 text-sm text-slate-300">
                      <span className="mb-2 block text-slate-400">Budget Range</span>
                      <select value={form.budgetRange} onChange={(event) => updateField('budgetRange', event.target.value)} className="w-full bg-transparent text-white outline-none">
                        {budgetOptions.map((option) => <option key={option} value={option} className="bg-slate-900">{option}</option>)}
                      </select>
                    </label>
                    <label className="rounded-[22px] border border-white/10 bg-slate-950/70 p-4 text-sm text-slate-300">
                      <span className="mb-2 block text-slate-400">Medical Conditions</span>
                      <input value={form.medicalConditions} onChange={(event) => updateField('medicalConditions', event.target.value)} className="w-full bg-transparent text-white outline-none" />
                    </label>
                    <label className="rounded-[22px] border border-white/10 bg-slate-950/70 p-4 text-sm text-slate-300 md:col-span-2">
                      <span className="mb-2 block text-slate-400">Smoking/Drinking habits</span>
                      <select value={form.habits} onChange={(event) => updateField('habits', event.target.value)} className="w-full bg-transparent text-white outline-none">
                        {habitsOptions.map((option) => <option key={option} value={option} className="bg-slate-900">{option}</option>)}
                      </select>
                    </label>
                  </div>
                ) : null}

                {step === 3 ? (
                  <div className="space-y-4">
                    <label className="block rounded-[22px] border border-white/10 bg-slate-950/70 p-4 text-sm text-slate-300">
                      <span className="mb-2 block text-slate-400">Coverage Priority</span>
                      <select value={form.coveragePriority} onChange={(event) => updateField('coveragePriority', event.target.value)} className="w-full bg-transparent text-white outline-none">
                        {priorityOptions.map((option) => <option key={option} value={option} className="bg-slate-900">{option}</option>)}
                      </select>
                    </label>
                    <div className="rounded-[24px] border border-white/10 bg-slate-950/70 p-4 text-sm text-slate-300">
                      <p className="font-semibold text-white">Profile snapshot</p>
                      <div className="mt-3 grid gap-2 sm:grid-cols-2">
                        <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-3">
                          <p className="text-slate-400">Preferred type</p>
                          <p className="mt-1 font-semibold text-white">{form.insuranceType}</p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-3">
                          <p className="text-slate-400">Budget</p>
                          <p className="mt-1 font-semibold text-white">{form.budgetRange}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}

                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <button type="button" onClick={handlePrevious} className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-slate-950/70 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:border-sky-400/20 hover:text-white" disabled={step === 0}>
                    <ArrowLeft className="h-4 w-4" />
                    Previous
                  </button>

                  <div className="flex gap-3">
                    {step < steps.length - 1 ? (
                      <button type="button" onClick={handleNext} className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-sky-500 to-violet-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:brightness-110">
                        Next
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    ) : (
                      <button type="button" onClick={handleGenerate} className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-sky-500 to-violet-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:brightness-110">
                        <Sparkles className="h-4 w-4" />
                        Generate Recommendation
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-[28px] border border-white/10 bg-slate-900/80 p-5 shadow-inner shadow-slate-950/20">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500/20 to-violet-500/20 text-sky-300">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">Recommendation Engine</p>
                      <p className="text-sm text-slate-400">Mock-based suggestions</p>
                    </div>
                  </div>

                  <div className="mt-4 space-y-3 text-sm text-slate-300">
                    <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-3">
                      <div className="flex items-center gap-2 text-white">
                        <Users className="h-4 w-4 text-sky-300" />
                        Household profile
                      </div>
                      <p className="mt-2 leading-6">{form.familyMembers} family members • {form.maritalStatus}</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-3">
                      <div className="flex items-center gap-2 text-white">
                        <TrendingUp className="h-4 w-4 text-violet-300" />
                        Budget focus
                      </div>
                      <p className="mt-2 leading-6">{form.coveragePriority} with {form.budgetRange} budget.</p>
                    </div>
                  </div>
                </div>

                {!submitted ? (
                  <div className="rounded-[28px] border border-dashed border-white/10 bg-slate-900/70 p-5 text-sm text-slate-400">
                    <div className="flex items-center gap-2 text-slate-200">
                      <BarChart3 className="h-4 w-4" />
                      Your recommendations will appear here
                    </div>
                    <p className="mt-3 leading-7">Complete the form and generate a shortlist of polished, mock insurance recommendations.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recommendations.map((recommendation) => (
                      <motion.div
                        key={recommendation.name}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-[28px] border border-white/10 bg-gradient-to-br from-slate-900/90 to-slate-950/90 p-5 shadow-xl shadow-slate-950/20"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-lg font-semibold text-white">{recommendation.name}</p>
                            <p className="mt-2 text-sm text-slate-400">Suitability score</p>
                            <p className="text-2xl font-semibold text-sky-300">{recommendation.suitabilityScore}</p>
                          </div>
                          <div className="rounded-2xl border border-sky-400/20 bg-sky-500/10 px-3 py-2 text-sm text-sky-200">
                            {recommendation.premium}
                          </div>
                        </div>

                        <div className="mt-4 rounded-[22px] border border-white/10 bg-slate-900/60 p-4">
                          <div className="flex items-center gap-2 text-sm font-semibold text-white">
                            <HeartPulse className="h-4 w-4 text-violet-300" />
                            Key benefits
                          </div>
                          <ul className="mt-3 space-y-2 text-sm text-slate-300">
                            {recommendation.benefits.map((benefit) => (
                              <li key={benefit} className="flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-sky-400" />
                                {benefit}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="mt-4 flex items-center justify-between gap-3">
                          <div className="text-sm text-slate-400">Estimated premium: {recommendation.premium}</div>
                          <button type="button" onClick={() => setSelectedCompare(recommendation.name)} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-sky-400/20 hover:text-white">
                            {selectedCompare === recommendation.name ? 'Compared' : 'Compare'}
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
