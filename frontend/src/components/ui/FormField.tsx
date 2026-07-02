import type { InputHTMLAttributes, ReactNode } from 'react'

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  icon: ReactNode
  suffix?: ReactNode
}

export default function FormField({
  label,
  error,
  icon,
  suffix,
  id,
  className,
  ...props
}: FormFieldProps) {
  return (
    <div className={className}> 
      <label htmlFor={id} className="mb-3 block text-sm font-semibold text-slate-200">
        {label}
        <span className="ml-1 text-sky-300">*</span>
      </label>
      <div className="relative rounded-3xl border border-white/10 bg-slate-950/80 px-4 py-3 shadow-inner shadow-slate-950/50 backdrop-blur-xl focus-within:border-sky-500/40">
        <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-slate-400">
          {icon}
        </div>
        <input
          id={id}
          className="w-full bg-transparent pl-12 pr-14 text-sm text-white outline-none placeholder:text-slate-500"
          {...props}
        />
        {suffix ? <div className="absolute inset-y-0 right-4 flex items-center">{suffix}</div> : null}
      </div>
      {error ? <p className="mt-2 text-sm text-rose-400">{error}</p> : null}
    </div>
  )
}
