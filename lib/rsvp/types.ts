// RSVP system type definitions

export interface RSVPFieldConfig {
  name: string
  type: 'text' | 'email' | 'textarea' | 'select' | 'radio' | 'number'
  label: string
  placeholder?: string
  required?: boolean
  options?: { value: string; label: string }[]
  validation?: { min?: number; max?: number; pattern?: string }
}

export interface RSVPTheme {
  primaryColor: string
  accentColor: string
  cardClass?: string
  buttonClass?: string
  labelClass?: string
  radioActiveClass?: string
  radioInactiveClass?: string
  successIconClass?: string
  successIcon?: React.ReactNode
}

export interface RSVPLabels {
  title: string
  subtitle: string
  submitButton: string
  submittingButton: string
  successTitle: string
  successMessage: string
  declineTitle: string
  declineMessage: string
}

export interface RSVPSubmissionAdapter {
  type: 'google-sheets' | 'supabase' | 'both'
  googleScriptUrl?: string
  supabaseUrl?: string
  supabaseAnonKey?: string
  supabaseTable?: string
}

export interface RSVPConfig {
  eventId: string
  eventName: string
  fields: RSVPFieldConfig[]
  adapter: RSVPSubmissionAdapter
  theme: RSVPTheme
  labels?: Partial<RSVPLabels>
}

// Default labels in Spanish
export const DEFAULT_LABELS: RSVPLabels = {
  title: 'Confirma tu Asistencia',
  subtitle: 'Nos encantaría contar contigo',
  submitButton: 'Enviar confirmación',
  submittingButton: 'Enviando...',
  successTitle: '¡Gracias por confirmar!',
  successMessage: '¡Nos vemos pronto!',
  declineTitle: 'Gracias por avisarnos',
  declineMessage: 'Lamentamos que no puedas acompañarnos. ¡Te echaremos de menos!',
}
