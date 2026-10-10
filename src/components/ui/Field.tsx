import { useId, type InputHTMLAttributes, type TextareaHTMLAttributes } from "react"
import { AlertCircle, CheckCircle2 } from "lucide-react"

interface FieldBase {
  label: string
  hint?: string
  error?: string
  success?: boolean
}

type InputField = FieldBase & { multiline?: false } & InputHTMLAttributes<HTMLInputElement>
type TextareaField = FieldBase & { multiline: true } & TextareaHTMLAttributes<HTMLTextAreaElement>
export type FieldProps = InputField | TextareaField

const control =
  "w-full rounded-control border bg-bg px-4 py-3 text-body text-text-primary placeholder:text-text-tertiary/70 " +
  "outline-none transition-colors duration-[var(--dur-micro)] " +
  "hover:border-border-strong focus:border-accent focus:ring-2 focus:ring-accent/25 " +
  "disabled:cursor-not-allowed disabled:opacity-50"

/** Labelled form control with hint, error and success states wired to ARIA. */
export default function Field(props: FieldProps) {
  const { label, hint, error, success, multiline, className = "", ...rest } = props
  const id = useId()
  const hintId = `${id}-hint`
  const errId = `${id}-err`
  const describedBy = [hint && hintId, error && errId].filter(Boolean).join(" ") || undefined
  const state = error ? "border-error" : success ? "border-success/60" : "border-border"

  const shared = {
    id,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": describedBy,
    className: `${control} ${state} ${className}`,
  }

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="flex items-center justify-between text-caption font-medium text-text-secondary">
        <span>
          {label}
          {rest.required && <span className="text-text-tertiary"> (required)</span>}
        </span>
        {success && !error && <CheckCircle2 size={14} className="text-success" aria-label="Looks good" />}
      </label>
      {multiline ? (
        <textarea {...(rest as TextareaHTMLAttributes<HTMLTextAreaElement>)} {...shared} />
      ) : (
        <input {...(rest as InputHTMLAttributes<HTMLInputElement>)} {...shared} />
      )}
      {hint && !error && (
        <p id={hintId} className="text-caption text-text-tertiary">
          {hint}
        </p>
      )}
      {error && (
        <p id={errId} role="alert" className="flex items-center gap-1.5 text-caption text-error">
          <AlertCircle size={13} aria-hidden /> {error}
        </p>
      )}
    </div>
  )
}
