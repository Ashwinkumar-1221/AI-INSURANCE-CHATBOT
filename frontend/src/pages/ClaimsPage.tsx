import { useState, type ChangeEvent, type DragEvent } from 'react'
import { motion } from 'framer-motion'
import {
  BadgeCheck,
  FilePlus2,
  FileText,
  FolderOpen,
  Info,
  Loader2,
  ShieldCheck,
  Sparkles,
  UploadCloud,
} from 'lucide-react'
import DashboardSidebar from '../components/ui/DashboardSidebar'
import DashboardTopbar from '../components/ui/DashboardTopbar'

interface ClaimItem {
  id: string
  policy: string
  date: string
  status: 'Submitted' | 'Under Review' | 'Approved' | 'Rejected' | 'Completed'
  amount: string
  category: string
  note: string
}

const claims: ClaimItem[] = [
  {
    id: 'CLM-1042',
    policy: 'Aurelia Health Shield',
    date: '2026-06-14',
    status: 'Under Review',
    amount: '₹48,000',
    category: 'Medical Treatment',
    note: 'Hospital bills and discharge summary attached.',
  },
  {
    id: 'CLM-1038',
    policy: 'DriveShield Plus',
    date: '2026-05-28',
    status: 'Approved',
    amount: '₹1,12,000',
    category: 'Vehicle Damage',
    note: 'Vehicle repair estimate verified by assessor.',
  },
  {
    id: 'CLM-1029',
    policy: 'Harbor Home Secure',
    date: '2026-04-19',
    status: 'Completed',
    amount: '₹82,500',
    category: 'Water Leakage',
    note: 'Final settlement processed and payout completed.',
  },
]

const timelineSteps = ['Submitted', 'Under Review', 'Approved/Rejected', 'Completed']

interface AnalysisResult {
  documentType: string
  fileName: string
  fileSize: string
  uploadedAt: string
  confidence: number
  summary: string[]
  claimRelated: boolean
}

const formatFileSize = (sizeInBytes: number) => {
  if (sizeInBytes < 1024) return `${sizeInBytes} B`
  if (sizeInBytes < 1024 * 1024) return `${(sizeInBytes / 1024).toFixed(1)} KB`
  return `${(sizeInBytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function ClaimsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selectedClaim, setSelectedClaim] = useState<ClaimItem>(claims[0])
  const [dragActive, setDragActive] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisError, setAnalysisError] = useState<string | null>(null)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)

  const uploadFile = async (file?: File) => {
    if (!file) return

    setIsAnalyzing(true)
    setAnalysisError(null)
    setAnalysisResult(null)

    const formData = new FormData()
    formData.append('file', file)
    const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
    try {
     const response = await fetch(`${API_URL}/upload/`, {
  method: "POST",
  body: formData,
})

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.detail || 'Upload failed.')
      }

      setAnalysisResult({
        documentType: data.document_type || 'Unknown',
        fileName: data.filename || file.name,
        fileSize: formatFileSize(Number(data.size || file.size || 0)),
        uploadedAt: data.uploaded_at ? new Date(data.uploaded_at).toLocaleString() : new Date().toLocaleString(),
        confidence: Number(data.confidence || 0),
        summary: Array.isArray(data.summary) ? data.summary : ['Document uploaded successfully.'],
        claimRelated: Boolean(data.claim_related),
      })
    } catch (error) {
      console.error(error)
      setAnalysisError('We could not analyze this document right now. Please try again in a moment.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    await uploadFile(file)
    event.target.value = ''
  }

  const handleDropUpload = async (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault()
    setDragActive(false)
    const file = event.dataTransfer.files?.[0]
    await uploadFile(file)
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
                  <ShieldCheck className="h-4 w-4" />
                  Claims management
                </div>
                <h1 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">Claims Center</h1>
                <p className="mt-3 text-sm leading-7 text-slate-300 sm:text-base">
                  Manage claim submissions, monitor progress, and keep your documentation ready with a premium support experience.
                </p>
              </div>

              <button type="button" onClick={() => { setDragActive(true); document.getElementById('claim-upload-zone')?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }} className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-sky-500 to-violet-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:brightness-110">
                <FilePlus2 className="h-4 w-4" />
                File New Claim
              </button>
            </div>

            <div className="mt-8 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-[28px] border border-white/10 bg-slate-900/80 p-5 shadow-inner shadow-slate-950/20"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-white">Document upload</p>
                      <p className="mt-1 text-sm text-slate-400">Drag and drop your claim documents here</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-3 text-sky-300">
                      <UploadCloud className="h-5 w-5" />
                    </div>
                  </div>

                  <label
                    htmlFor="claim-upload"
                    id="claim-upload-zone"
                    className={`mt-5 flex cursor-pointer flex-col items-center justify-center rounded-[24px] border border-dashed px-6 py-10 text-center transition ${dragActive ? 'border-sky-400/50 bg-sky-500/10' : 'border-white/10 bg-slate-950/70 hover:border-sky-400/30 hover:bg-slate-900/70'}`}
                    onDragOver={(event) => {
                      event.preventDefault()
                      setDragActive(true)
                    }}
                    onDragLeave={() => setDragActive(false)}
                    onDrop={(event) => {
                      void handleDropUpload(event)
                    }}
                  >
                    <FolderOpen className="h-8 w-8 text-sky-300" />
                    <p className="mt-3 text-sm font-semibold text-white">Drop files here or browse</p>
                    <p className="mt-2 text-sm text-slate-400">PDF, JPG, PNG up to 10MB</p>
                    <span className="mt-4 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">Upload Documents</span>
                  </label>
                  <input
                    id="claim-upload"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden"
                    onChange={handleFileUpload}
                  />

                  {isAnalyzing ? (
                    <div className="mt-5 rounded-[24px] border border-sky-400/20 bg-sky-500/10 p-4 text-sm text-sky-100">
                      <div className="flex items-center gap-3">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>Analyzing your document with AI…</span>
                      </div>
                    </div>
                  ) : null}

                  {analysisError ? (
                    <div className="mt-5 rounded-[24px] border border-rose-400/20 bg-rose-500/10 p-4 text-sm text-rose-100">
                      {analysisError}
                    </div>
                  ) : null}

                  {analysisResult ? (
                    <div className="mt-5 rounded-[24px] border border-white/10 bg-slate-950/70 p-4">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-white">Document analysis</p>
                          <p className="mt-1 text-sm text-slate-400">AI-assisted claim readiness summary</p>
                        </div>
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${analysisResult.claimRelated ? 'bg-emerald-500/15 text-emerald-300' : 'bg-amber-500/15 text-amber-300'}`}>
                          {analysisResult.claimRelated ? '✓ Ready for Claim Submission' : 'Missing Supporting Documents'}
                        </span>
                      </div>

                      <div className="mt-4 grid gap-3 text-sm text-slate-300 sm:grid-cols-2">
                        <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-3">
                          <p className="text-slate-400">Document Type</p>
                          <p className="mt-1 font-semibold text-white">{analysisResult.documentType}</p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-3">
                          <p className="text-slate-400">File Name</p>
                          <p className="mt-1 font-semibold text-white">{analysisResult.fileName}</p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-3">
                          <p className="text-slate-400">File Size</p>
                          <p className="mt-1 font-semibold text-white">{analysisResult.fileSize}</p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-3">
                          <p className="text-slate-400">Upload Time</p>
                          <p className="mt-1 font-semibold text-white">{analysisResult.uploadedAt}</p>
                        </div>
                      </div>

                      <div className="mt-4 rounded-2xl border border-white/10 bg-slate-900/70 p-3">
                        <p className="text-slate-400">AI Confidence</p>
                        <p className="mt-1 font-semibold text-white">{analysisResult.confidence}%</p>
                      </div>

                      <div className="mt-4 rounded-2xl border border-white/10 bg-slate-900/70 p-3">
                        <p className="text-slate-400">AI Summary</p>
                        <ul className="mt-2 space-y-2 text-sm text-slate-300">
                          {analysisResult.summary.map((item) => (
                            <li key={item} className="flex gap-2">
                              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-sky-300" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ) : null}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 }}
                  className="overflow-hidden rounded-[28px] border border-white/10 bg-slate-900/80 shadow-inner shadow-slate-950/20"
                >
                  <div className="border-b border-white/10 px-5 py-4">
                    <p className="text-sm font-semibold text-white">Recent claims</p>
                    <p className="mt-1 text-sm text-slate-400">Track the latest updates and status changes</p>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm">
                      <thead className="bg-slate-950/70 text-slate-400">
                        <tr>
                          <th className="px-5 py-3 font-medium">Claim ID</th>
                          <th className="px-5 py-3 font-medium">Policy</th>
                          <th className="px-5 py-3 font-medium">Date</th>
                          <th className="px-5 py-3 font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {claims.map((claim) => (
                          <tr key={claim.id} onClick={() => setSelectedClaim(claim)} className={`cursor-pointer border-t border-white/10 transition ${selectedClaim.id === claim.id ? 'bg-sky-500/10' : 'bg-transparent hover:bg-slate-950/40'}`}>
                            <td className="px-5 py-4 font-semibold text-white">{claim.id}</td>
                            <td className="px-5 py-4 text-slate-300">{claim.policy}</td>
                            <td className="px-5 py-4 text-slate-300">{claim.date}</td>
                            <td className="px-5 py-4">
                              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${claim.status === 'Completed' ? 'bg-emerald-500/15 text-emerald-300' : claim.status === 'Approved' ? 'bg-sky-500/15 text-sky-300' : claim.status === 'Rejected' ? 'bg-rose-500/15 text-rose-300' : 'bg-violet-500/15 text-violet-300'}`}>
                                {claim.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              </div>

              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="rounded-[28px] border border-white/10 bg-slate-900/80 p-5 shadow-inner shadow-slate-950/20"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500/20 to-violet-500/20 text-sky-300">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">Claim details</p>
                      <p className="text-sm text-slate-400">Selected case summary</p>
                    </div>
                  </div>

                  <div className="mt-5 rounded-[24px] border border-white/10 bg-slate-950/70 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-lg font-semibold text-white">{selectedClaim.id}</p>
                        <p className="mt-1 text-sm text-slate-400">{selectedClaim.policy}</p>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${selectedClaim.status === 'Completed' ? 'bg-emerald-500/15 text-emerald-300' : selectedClaim.status === 'Approved' ? 'bg-sky-500/15 text-sky-300' : selectedClaim.status === 'Rejected' ? 'bg-rose-500/15 text-rose-300' : 'bg-violet-500/15 text-violet-300'}`}>
                        {selectedClaim.status}
                      </span>
                    </div>

                    <div className="mt-4 grid gap-3 text-sm text-slate-300 sm:grid-cols-2">
                      <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-3">
                        <p className="text-slate-400">Category</p>
                        <p className="mt-1 font-semibold text-white">{selectedClaim.category}</p>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-3">
                        <p className="text-slate-400">Estimated payout</p>
                        <p className="mt-1 font-semibold text-white">{selectedClaim.amount}</p>
                      </div>
                    </div>

                    <div className="mt-4 rounded-2xl border border-white/10 bg-slate-900/60 p-4 text-sm leading-7 text-slate-300">
                      {selectedClaim.note}
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 }}
                  className="rounded-[28px] border border-white/10 bg-slate-900/80 p-5 shadow-inner shadow-slate-950/20"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500/20 to-violet-500/20 text-sky-300">
                      <BadgeCheck className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">Claim progress</p>
                      <p className="text-sm text-slate-400">Lifecycle overview</p>
                    </div>
                  </div>

                  <div className="mt-5 space-y-4">
                    {timelineSteps.map((step, index) => {
                      const currentIndex = ['Submitted', 'Under Review', 'Approved', 'Completed'].indexOf(selectedClaim.status)
                      const isActive = index <= currentIndex
                      const isCurrent = index === currentIndex

                      return (
                        <div key={step} className="flex items-start gap-3">
                          <div className={`mt-1 h-3.5 w-3.5 rounded-full border-2 ${isActive ? 'border-sky-400 bg-sky-400' : 'border-white/15 bg-transparent'}`} />
                          <div className={`rounded-2xl border px-4 py-3 ${isCurrent ? 'border-sky-400/30 bg-sky-500/10' : isActive ? 'border-white/10 bg-slate-950/70' : 'border-white/5 bg-slate-900/40'}`}>
                            <p className="text-sm font-semibold text-white">{step}</p>
                            <p className="mt-1 text-sm text-slate-400">
                              {isCurrent ? 'Currently in progress' : isActive ? 'Completed stage' : 'Upcoming stage'}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="rounded-[28px] border border-white/10 bg-gradient-to-br from-slate-900/90 to-slate-950/90 p-5 shadow-inner shadow-slate-950/20"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/20 to-sky-500/20 text-violet-200">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">AI tips</p>
                      <p className="text-sm text-slate-400">Filing claims faster</p>
                    </div>
                  </div>

                  <div className="mt-4 rounded-[24px] border border-white/10 bg-slate-900/70 p-4 text-sm leading-7 text-slate-300">
                    <div className="flex items-start gap-2">
                      <Info className="mt-1 h-4 w-4 text-sky-300" />
                      <span>Keep original bills, medical reports, and proof of loss ready to shorten the review cycle.</span>
                    </div>
                    <div className="mt-3 flex items-start gap-2">
                      <Info className="mt-1 h-4 w-4 text-sky-300" />
                      <span>Use clear descriptions and exact dates so the assessor can validate the claim quickly.</span>
                    </div>
                    <div className="mt-3 flex items-start gap-2">
                      <Info className="mt-1 h-4 w-4 text-sky-300" />
                      <span>Attach supporting documents in one batch to avoid repeated follow-ups.</span>
                    </div>
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
