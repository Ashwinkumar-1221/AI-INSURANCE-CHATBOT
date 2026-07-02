import { useCallback, useEffect, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import axios from 'axios'
import { motion } from 'framer-motion'
import {
  BadgeCheck,
  Bot,
  BotMessageSquare,
  Brain,
  Clock3,
  Compass,
  Mic,
  Paperclip,
  Send,
  ShieldCheck,
  Sparkles,
  UserRound,
  Zap,
} from 'lucide-react'
import DashboardSidebar from '../components/ui/DashboardSidebar'
import DashboardTopbar from '../components/ui/DashboardTopbar'

interface ChatMessage {
  id: number
  role: 'assistant' | 'user'
  content: string
  time: string
}

type VoiceLanguage = 'en' | 'hi' | 'te'
type VoiceMode = 'push-to-talk' | 'continuous'
type VoiceStatus = 'idle' | 'listening' | 'thinking' | 'speaking'

type SpeechRecognitionAlternativeLike = {
  transcript: string
  confidence: number
  isFinal?: boolean
}

type SpeechRecognitionResultLike = {
  isFinal: boolean
  length: number
  item(index: number): SpeechRecognitionAlternativeLike | null
}

type SpeechRecognitionEventLike = {
  resultIndex: number
  results: ArrayLike<SpeechRecognitionResultLike>
}

type SpeechRecognitionLike = {
  continuous: boolean
  interimResults: boolean
  lang: string
  onresult: ((event: SpeechRecognitionEventLike) => void) | null
  onerror: ((event: { error: string }) => void) | null
  onend: (() => void) | null
  start: () => void
  stop: () => void
  abort: () => void
}

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognitionLike
    webkitSpeechRecognition?: new () => SpeechRecognitionLike
  }
}

const initialConversationMessages: ChatMessage[] = [
  {
    id: 1,
    role: 'assistant',
    content: 'I can help compare health, vehicle, and term plans based on your profile.',
    time: '09:42',
  },
  {
    id: 2,
    role: 'user',
    content: 'Which plan gives the best balance of coverage and price?',
    time: '09:43',
  },
  {
    id: 3,
    role: 'assistant',
    content: 'Based on your recent preferences, a premium family plan with wellness add-ons is the strongest match.',
    time: '09:44',
  },
]

const topics = ['Health coverage', 'Vehicle protection', 'Claim readiness', 'Retirement planning']

const suggestedQuestions = [
  'Which health insurance suits me?',
  'Recommend a vehicle insurance.',
  'Help me file a claim.',
  'Explain term insurance.',
]

const popularQueries = ['Claim eligibility', 'Policy renewal', 'Group discounts', 'Coverage comparison']

const voiceLanguageLabels: Record<VoiceLanguage, string> = {
  en: 'English',
  hi: 'Hindi',
  te: 'Telugu',
}

const voiceLanguageCodes: Record<VoiceLanguage, string> = {
  en: 'en-US',
  hi: 'hi-IN',
  te: 'te-IN',
}

function getTimeLabel() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function detectVoiceLanguage(text: string): VoiceLanguage {
  if (/[ऀ-ॿ]/.test(text)) {
    return 'hi'
  }

  if (/[అ-ి]/.test(text)) {
    return 'te'
  }

  return 'en'
}

function getInitialVoiceLanguage() {
  if (typeof navigator === 'undefined') {
    return 'en' as VoiceLanguage
  }

  const browserLanguage = navigator.language.toLowerCase()
  if (browserLanguage.startsWith('hi')) {
    return 'hi' as VoiceLanguage
  }

  if (browserLanguage.startsWith('te')) {
    return 'te' as VoiceLanguage
  }

  return 'en' as VoiceLanguage
}

const apiBaseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/$/, '')

export default function AIChatPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'chat' | 'voice'>('chat')
  const [draft, setDraft] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
  const saved = localStorage.getItem("insurance-chat-history")

  if (saved) {
    try {
      return JSON.parse(saved)
    } catch {
      return initialConversationMessages
    }
  }

  return initialConversationMessages
})
  const [isTyping, setIsTyping] = useState(false)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [isListening, setIsListening] = useState(false)
  const [voiceMode, setVoiceMode] = useState<VoiceMode>('continuous')
  const [voiceStatus, setVoiceStatus] = useState<VoiceStatus>('idle')
  const [voiceLanguage, setVoiceLanguage] = useState<VoiceLanguage>(getInitialVoiceLanguage())
  const [liveTranscript, setLiveTranscript] = useState('')

  const recognitionRef = useRef<SpeechRecognitionLike | null>(null)
  const attachmentInputRef = useRef<HTMLInputElement | null>(null)
  const isListeningRef = useRef(false)
  const isTypingRef = useRef(false)
  const conversationIdRef = useRef<string | null>(null)
  const voiceModeRef = useRef<VoiceMode>('continuous')
useEffect(() => {
  localStorage.setItem(
    "insurance-chat-history",
    JSON.stringify(messages)
  )
}, [messages])
  const stopSpeaking = useCallback(() => {
    window.speechSynthesis.cancel()
  }, [])

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop()
    isListeningRef.current = false
    setIsListening(false)
    setVoiceStatus(isTypingRef.current ? 'thinking' : 'idle')
  }, [])

  const startListening = useCallback(() => {
    const recognition = recognitionRef.current
    if (!recognition || isListeningRef.current) {
      return
    }

    stopSpeaking()
    setLiveTranscript('')
    setVoiceStatus('listening')
    setIsListening(true)
    isListeningRef.current = true
    recognition.lang = voiceLanguageCodes[voiceLanguage]
    recognition.start()
  }, [stopSpeaking, voiceLanguage])

  const handleSendMessage = useCallback(async (content: string, explicitLanguage?: VoiceLanguage) => {
    const trimmed = content.trim()

    if (!trimmed || isTypingRef.current) {
      return
    }

    const activeLanguage = explicitLanguage ?? voiceLanguage
    const languageInstruction = `Please answer in ${voiceLanguageLabels[activeLanguage]}.`
    const messageForBackend = `${trimmed}\n\n${languageInstruction}`

    let activeConversationId = conversationIdRef.current
    if (!activeConversationId) {
      activeConversationId = typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `conversation-${Date.now()}`
      conversationIdRef.current = activeConversationId
      setConversationId(activeConversationId)
    }

    const userMessage: ChatMessage = {
      id: Date.now(),
      role: 'user',
      content: trimmed,
      time: getTimeLabel(),
    }

    setMessages((currentMessages) => [...currentMessages, userMessage])
    setDraft('')
    setIsTyping(true)
    isTypingRef.current = true
    setVoiceStatus('thinking')
    stopListening()

    try {
      const response = await axios.post(`${apiBaseUrl}/chat`, {
        message: messageForBackend,
        conversation_id: activeConversationId,
        language: activeLanguage,
      })

      const assistantMessage: ChatMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: response.data?.reply || 'I could not generate a response right now.',
        time: getTimeLabel(),
      }

      setMessages((currentMessages) => [...currentMessages, assistantMessage])
     if (activeTab === 'voice') {
    setVoiceStatus('speaking')

    const utterance = new SpeechSynthesisUtterance(assistantMessage.content)

    utterance.lang = voiceLanguageCodes[activeLanguage]
    utterance.rate = 1

    utterance.onend = () => {
        if (isListeningRef.current && voiceModeRef.current === 'continuous') {
            setVoiceStatus('listening')
            return
        }

        setVoiceStatus('idle')
    }

    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(utterance)
} else {
    setVoiceStatus('idle')
}
    } catch (error) {
      const assistantMessage: ChatMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: 'I am having trouble reaching the assistant right now. Please try again in a moment.',
        time: getTimeLabel(),
      }

      setMessages((currentMessages) => [...currentMessages, assistantMessage])
      setVoiceStatus('idle')
    } finally {
      setIsTyping(false)
      isTypingRef.current = false
    }
  }, [stopListening, voiceLanguage,activeTab])

  useEffect(() => {
    conversationIdRef.current = conversationId
  }, [conversationId])

  useEffect(() => {
    voiceModeRef.current = voiceMode
  }, [voiceMode])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const SpeechRecognitionCtor = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognitionCtor) {
      return
    }

    const recognition = new SpeechRecognitionCtor()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = voiceLanguageCodes[voiceLanguage]

    recognition.onresult = (event) => {
      let interimTranscript = ''
      let finalTranscript = ''

      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        const result = event.results[index]
        const firstAlternative = result.item(0)
        const transcriptText = firstAlternative?.transcript.trim() ?? ''

        if (result.isFinal) {
          finalTranscript += `${transcriptText} `
        } else {
          interimTranscript += `${transcriptText} `
        }
      }

      if (finalTranscript) {
        const detectedLanguage = detectVoiceLanguage(finalTranscript)
        setVoiceLanguage(detectedLanguage)
        setLiveTranscript(finalTranscript)
        stopListening()
        void handleSendMessage(finalTranscript, detectedLanguage)
      } else if (interimTranscript) {
        setLiveTranscript(interimTranscript)
      }
    }

    recognition.onerror = () => {
      setVoiceStatus('idle')
      setIsListening(false)
      isListeningRef.current = false
      setLiveTranscript('')
    }

    recognition.onend = () => {
      if (isListeningRef.current && voiceModeRef.current === 'continuous') {
        recognition.start()
      } else {
        setIsListening(false)
        setVoiceStatus(isTypingRef.current ? 'thinking' : 'idle')
        isListeningRef.current = false
      }
    }

    recognitionRef.current = recognition

    return () => {
      recognition.stop()
      recognitionRef.current = null
    }
  }, [handleSendMessage, stopListening, voiceLanguage])

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      void handleSendMessage(draft)
    }
  }

  const toggleVoiceMode = () => {
    setVoiceMode((currentMode) => (currentMode === 'continuous' ? 'push-to-talk' : 'continuous'))
  }

  const handleMicPointerDown = () => {
    if (voiceMode === 'push-to-talk') {
      startListening()
    }
  }

  const handleMicPointerUp = () => {
    if (voiceMode === 'push-to-talk') {
      stopListening()
    }
  }

  const handleMicClick = () => {
    if (voiceMode === 'continuous') {
      if (isListeningRef.current) {
        stopListening()
      } else {
        startListening()
      }
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <DashboardSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 lg:ml-80">
        <main className="w-full px-4 pb-8 pt-4 sm:px-6 lg:px-8 lg:pb-10 lg:pt-6">
          <DashboardTopbar onMenuClick={() => setSidebarOpen(true)} />

          <div className="mt-6 grid gap-6 xl:grid-cols-[1.45fr_0.85fr]">
            <div className="space-y-6">
              <motion.section
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                className="overflow-hidden rounded-[32px] border border-white/10 bg-slate-950/80 p-6 shadow-2xl shadow-slate-950/30 backdrop-blur-2xl"
              >
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                  <div className="max-w-xl">
                    <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/20 bg-sky-500/10 px-3 py-1 text-sm text-sky-200">
                      <Sparkles className="h-4 w-4" />
                      Premium AI Experience
                    </div>
                    <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                      AI Insurance Assistant
                    </h1>
                    <p className="mt-3 text-sm leading-7 text-slate-300 sm:text-base">
                      Get instant policy guidance, claim support, and personalized recommendations in a beautifully crafted conversational workspace.
                    </p>
                    <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-2 text-sm font-medium text-emerald-200">
                      <BadgeCheck className="h-4 w-4" />
                      Status: Ready
                    </div>
                  </div>

                  <div className="relative mx-auto flex h-56 w-56 items-center justify-center sm:h-64 sm:w-64">
                    <motion.div
                      animate={{ scale: [1, 1.06, 1], opacity: [0.85, 1, 0.85] }}
                      transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
                      className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(56,189,248,0.55),transparent_35%),radial-gradient(circle_at_70%_30%,rgba(167,139,250,0.55),transparent_35%),radial-gradient(circle_at_50%_80%,rgba(34,211,238,0.4),transparent_30%)] blur-3xl"
                    />
                    <motion.div
                      animate={{ y: [0, -8, 0], rotate: [0, 4, 0] }}
                      transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                      className="relative flex h-44 w-44 items-center justify-center rounded-full border border-white/20 bg-gradient-to-br from-sky-400/90 via-violet-500/80 to-cyan-300/90 shadow-[0_0_80px_rgba(56,189,248,0.35)]"
                    >
                      <div className="absolute inset-4 rounded-full border border-white/20" />
                      <div className="absolute inset-8 rounded-full border border-white/15" />
                      <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.9)_0%,transparent_52%)]" />
                      <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-slate-950/30 backdrop-blur-xl">
                        <Brain className="h-10 w-10 text-white" />
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.section>

              <motion.section
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.06 }}
                className="overflow-hidden rounded-[32px] border border-white/10 bg-slate-950/80 shadow-2xl shadow-slate-950/25 backdrop-blur-2xl"
              >
                <div className="flex flex-col gap-3 border-b border-white/10 px-5 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-white">Live conversation</p>
                    <p className="text-sm text-slate-400">Personal policy guidance and premium support</p>
                  </div>
                  <div className="flex items-center gap-2 rounded-full border border-white/10 bg-slate-900/70 p-1">
                    <button
                      type="button"
                      onClick={() => setActiveTab('chat')}
                      className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${activeTab === 'chat' ? 'bg-sky-500/20 text-sky-200' : 'text-slate-400 hover:text-white'}`}
                    >
                      💬 Chat
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('voice')}
                      className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${activeTab === 'voice' ? 'bg-sky-500/20 text-sky-200' : 'text-slate-400 hover:text-white'}`}
                    >
                      🎤 Voice
                    </button>
                  </div>
                  <div className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-sm text-emerald-200">
                    Online
                  </div>
                </div>
                {activeTab === "chat" && (
  <div className="max-h-[420px] space-y-4 overflow-y-auto px-4 py-5 sm:px-6">
                  {messages.map((message) => (
                    <div key={message.id} className={`flex ${message.role === 'assistant' ? 'justify-start' : 'justify-end'}`}>
                      <div className={`max-w-[86%] rounded-[24px] px-4 py-3 shadow-lg sm:max-w-[78%] ${message.role === 'assistant' ? 'border border-white/10 bg-slate-900/85 text-slate-200' : 'bg-gradient-to-r from-sky-500/25 to-violet-500/25 text-slate-100'}`}>
                        <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-slate-400">
                          {message.role === 'assistant' ? <Bot className="h-3.5 w-3.5" /> : <UserRound className="h-3.5 w-3.5" />}
                          {message.role === 'assistant' ? 'AI Assistant' : 'You'}
                        </div>
                        <p className="text-sm leading-7">{message.content}</p>
                        <div className="mt-2 flex items-center justify-end gap-2 text-[11px] text-slate-400">
                          <Clock3 className="h-3 w-3" />
                          {message.time}
                        </div>
                      </div>
                    </div>
                  ))}

                  {isTyping ? (
                    <div className="flex justify-start">
                      <div className="rounded-[24px] border border-white/10 bg-slate-900/85 px-4 py-3 shadow-lg">
                        <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-slate-400">
                          <Bot className="h-3.5 w-3.5" />
                          AI Assistant
                        </div>
                        <div className="flex items-center gap-2">
                          <motion.span
                            animate={{ y: [0, -3, 0] }}
                            transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut' }}
                            className="h-2.5 w-2.5 rounded-full bg-sky-400"
                          />
                          <motion.span
                            animate={{ y: [0, -3, 0] }}
                            transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut', delay: 0.15 }}
                            className="h-2.5 w-2.5 rounded-full bg-violet-400"
                          />
                          <motion.span
                            animate={{ y: [0, -3, 0] }}
                            transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
                            className="h-2.5 w-2.5 rounded-full bg-cyan-400"
                          />
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
                )}
                {activeTab === "voice" && (
  <div className="flex flex-col items-center justify-center py-16 px-6 text-center">

    <div className="h-36 w-36 rounded-full bg-gradient-to-r from-sky-500 to-violet-500 animate-pulse shadow-[0_0_60px_rgba(56,189,248,0.45)] flex items-center justify-center">

      <Brain className="h-12 w-12 text-white" />

    </div>

   <h3 className="mt-6 text-xl font-semibold text-white">
  {voiceStatus === "listening"
    ? "🎤 Listening..."
    : voiceStatus === "thinking"
    ? "🧠 Thinking..."
    : voiceStatus === "speaking"
    ? "🔊 Speaking..."
    : "AI Voice Assistant"}
</h3>

    <p className="mt-2 text-slate-400">
  {liveTranscript
    ? liveTranscript
    : "Press Start and begin speaking naturally."}
</p>
    <div className="mt-8 flex flex-wrap justify-center gap-3">

  <button
    onClick={startListening}
    className="rounded-xl bg-emerald-500 px-5 py-3 font-medium text-white hover:bg-emerald-600"
  >
    🎤 Start
  </button>

  <button
    onClick={() => window.speechSynthesis.pause()}
    className="rounded-xl bg-yellow-500 px-5 py-3 font-medium text-white hover:bg-yellow-600"
  >
    ⏸ Pause
  </button>

  <button
    onClick={() => window.speechSynthesis.resume()}
    className="rounded-xl bg-blue-500 px-5 py-3 font-medium text-white hover:bg-blue-600"
  >
    ▶ Resume
  </button>

  <button
    onClick={() => {
      stopListening()
      window.speechSynthesis.cancel()
    }}
    className="rounded-xl bg-red-500 px-5 py-3 font-medium text-white hover:bg-red-600"
  >
    ⏹ Stop
  </button>

</div>

  </div>
)}
                {activeTab === "chat" && (
<div className="border-t border-white/10 bg-slate-900/80 px-4 py-4 sm:px-6">
                  <div className="flex flex-col gap-3 rounded-[24px] border border-white/10 bg-slate-950/70 p-3 shadow-inner shadow-slate-950/20 sm:flex-row sm:items-center">
                    <button type="button" onClick={() => attachmentInputRef.current?.click()} className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-slate-900/90 text-slate-200 transition hover:border-sky-400/20 hover:text-white">
                      <Paperclip className="h-5 w-5" />
                    </button>
                    <input ref={attachmentInputRef} type="file" className="hidden" accept="image/*,.pdf,.doc,.docx" onChange={() => undefined} />
                    <div className="flex-1">
                      <input
                        value={draft}
                        onChange={(event) => setDraft(event.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask about policy coverage, claims, or recommendations"
                        className="w-full rounded-2xl border border-transparent bg-transparent px-3 py-3 text-sm text-slate-100 outline-none placeholder:text-slate-500"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={toggleVoiceMode}
                        className="rounded-full border border-sky-400/20 bg-sky-500/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-sky-200"
                      >
                        {voiceMode === 'continuous' ? 'Live' : 'PTT'}
                      </button>
                      <button
                        type="button"
                        onMouseDown={handleMicPointerDown}
                        onMouseUp={handleMicPointerUp}
                        onTouchStart={handleMicPointerDown}
                        onTouchEnd={handleMicPointerUp}
                        onClick={handleMicClick}
                        aria-label="Voice input"
                        className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl border transition ${isListening ? 'border-emerald-400/40 bg-emerald-500/20 text-emerald-200' : 'border-white/10 bg-slate-900/90 text-slate-200 hover:border-sky-400/20 hover:text-white'}`}
                      >
                        <Mic className="h-5 w-5" />
                      </button>
                    </div>
                    <button type="button" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sky-500 to-violet-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:brightness-110" onClick={() => void handleSendMessage(draft)}>
                      <Send className="h-4 w-4" />
                      Send
                    </button>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-slate-400">
                    <span className={`rounded-full px-3 py-1 ${voiceStatus === 'listening' ? 'bg-emerald-500/15 text-emerald-200' : voiceStatus === 'thinking' ? 'bg-amber-500/15 text-amber-200' : voiceStatus === 'speaking' ? 'bg-violet-500/15 text-violet-200' : 'bg-slate-800/80 text-slate-300'}`}>
                      {voiceStatus === 'listening' ? 'Listening' : voiceStatus === 'thinking' ? 'Thinking' : voiceStatus === 'speaking' ? 'Speaking' : 'Ready'}
                    </span>
                    <span className="rounded-full border border-white/10 bg-slate-900/70 px-3 py-1">
                      {voiceLanguageLabels[voiceLanguage]}
                    </span>
                    {liveTranscript ? <span className="text-slate-300">{liveTranscript}</span> : null}
                  </div>
                </div>
                )}
              </motion.section>
            </div>
    
            <div className="space-y-6">
              <motion.aside
                initial={{ opacity: 0, x: 18 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.08 }}
                className="rounded-[32px] border border-white/10 bg-slate-950/80 p-6 shadow-2xl shadow-slate-950/30 backdrop-blur-2xl"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-sky-300/80">Conversation</p>
                    <h2 className="mt-3 text-2xl font-semibold text-white">Summary</h2>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-slate-900/80 px-3 py-2 text-sm text-slate-200">
                    <span className="text-sky-300">3</span> insights
                  </div>
                </div>

                <div className="mt-6 rounded-[24px] border border-white/10 bg-gradient-to-br from-sky-500/10 to-violet-500/10 p-5">
                  <div className="flex items-center gap-3 text-slate-100">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900/80 text-sky-300">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold">Coverage match</p>
                      <p className="text-sm text-slate-400">Premium family protection is the strongest fit.</p>
                    </div>
                  </div>
                  <div className="mt-5 flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-slate-300">
                    <span>Responsiveness</span>
                    <span className="font-semibold text-white">Instant</span>
                  </div>
                </div>

                <div className="mt-6">
                  <p className="text-sm font-semibold text-white">Recent topics</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {topics.map((topic) => (
                      <span key={topic} className="rounded-full border border-white/10 bg-slate-900/80 px-3 py-2 text-sm text-slate-300">
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.aside>

              <motion.aside
                initial={{ opacity: 0, x: 18 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.12 }}
                className="rounded-[32px] border border-white/10 bg-slate-950/80 p-6 shadow-2xl shadow-slate-950/30 backdrop-blur-2xl"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500/20 to-violet-500/20 text-sky-300">
                    <Zap className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">Suggested questions</p>
                    <p className="text-sm text-slate-400">Jump-start your next conversation</p>
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  {suggestedQuestions.map((question) => (
                    <button key={question} type="button" onClick={() => void handleSendMessage(question)} className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-left text-sm text-slate-200 transition hover:border-sky-400/20 hover:bg-slate-900">
                      <span>{question}</span>
                      <Compass className="h-4 w-4 text-slate-500" />
                    </button>
                  ))}
                </div>

                <div className="mt-6">
                  <p className="text-sm font-semibold text-white">Popular insurance queries</p>
                  <div className="mt-4 space-y-2">
                    {popularQueries.map((query) => (
                      <div key={query} className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-slate-300">
                        <span>{query}</span>
                        <BotMessageSquare className="h-4 w-4 text-sky-300" />
                      </div>
                    ))}
                  </div>
                </div>
              </motion.aside>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
