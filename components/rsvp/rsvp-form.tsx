'use client'

import { useState, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { cn } from '@/lib/utils'
import { createRSVPSchema } from '@/lib/rsvp/schemas'
import { submitRSVP } from '@/lib/rsvp/adapters/multi'
import { DEFAULT_LABELS, type RSVPConfig, type RSVPFieldConfig, type RSVPTheme } from '@/lib/rsvp/types'
import { AttendanceToggle } from './attendance-toggle'
import { RSVPSuccess } from './rsvp-success'

interface RSVPFormProps {
  config: RSVPConfig
}

// Renders the appropriate input component based on field type
function renderFieldInput(
  field: RSVPFieldConfig,
  formField: { value: string; onChange: (value: string) => void },
  theme: RSVPTheme
) {
  switch (field.type) {
    case 'email':
    case 'text':
      return (
        <Input
          placeholder={field.placeholder}
          className="rounded-xl py-6"
          value={formField.value}
          onChange={(e) => formField.onChange(e.target.value)}
        />
      )

    case 'number':
      return (
        <Input
          type="number"
          placeholder={field.placeholder}
          className="rounded-xl py-6"
          min={field.validation?.min}
          max={field.validation?.max}
          value={formField.value}
          onChange={(e) => formField.onChange(e.target.value)}
        />
      )

    case 'textarea':
      return (
        <Textarea
          placeholder={field.placeholder}
          className="rounded-xl min-h-24 resize-none"
          value={formField.value}
          onChange={(e) => formField.onChange(e.target.value)}
        />
      )

    case 'select':
      return (
        <select
          className="w-full rounded-xl py-3 px-4 border-2 border-border bg-background"
          value={formField.value}
          onChange={(e) => formField.onChange(e.target.value)}
        >
          {field.options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )

    case 'radio':
      // Use toggle-style buttons for attendance-like fields (yes/no with 2 options)
      if (field.options && field.options.length === 2 && field.name.includes('attend')) {
        return (
          <AttendanceToggle
            field={field}
            value={formField.value}
            onChange={formField.onChange}
            theme={theme}
          />
        )
      }
      // Use standard RadioGroup for other radio fields
      return (
        <RadioGroup
          value={formField.value}
          onValueChange={formField.onChange}
          className="flex gap-4"
        >
          {field.options?.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <RadioGroupItem
                value={option.value}
                id={`${field.name}-${option.value}`}
                className={theme.labelClass}
              />
              <Label
                htmlFor={`${field.name}-${option.value}`}
                className={cn('cursor-pointer', theme.labelClass)}
              >
                {option.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      )

    default:
      return null
  }
}

// Main reusable RSVP form component
export function RSVPForm({ config }: RSVPFormProps) {
  const [submitted, setSubmitted] = useState(false)
  const [submittedData, setSubmittedData] = useState<Record<string, unknown>>({})
  const labels = { ...DEFAULT_LABELS, ...config.labels }

  const schema = useMemo(() => createRSVPSchema(config.fields), [config.fields])

  // Build default values from config
  const defaultValues = useMemo(() => {
    const values: Record<string, string> = {}
    for (const field of config.fields) {
      if (field.type === 'radio' && field.options?.length) {
        values[field.name] = field.options[0].value
      } else if (field.type === 'select' && field.options?.length) {
        values[field.name] = field.options[0].value
      } else {
        values[field.name] = ''
      }
    }
    return values
  }, [config.fields])

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  })

  const onSubmit = async (data: Record<string, unknown>) => {
    const result = await submitRSVP(config.adapter, config.eventId, data)
    if (result.success) {
      setSubmittedData(data)
      setSubmitted(true)
      toast.success(labels.successTitle)
    } else {
      toast.error(result.error ?? 'Error al enviar. Inténtalo de nuevo.')
    }
  }

  if (submitted) {
    return <RSVPSuccess config={config} data={submittedData} />
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn(
          'space-y-6 p-8 rounded-3xl bg-card border-2 border-border',
          config.theme.cardClass
        )}
      >
        {config.fields.map((field) => (
          <FormField
            key={field.name}
            control={form.control}
            name={field.name}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel className={cn('text-sm font-medium', config.theme.labelClass)}>
                  {field.label}
                </FormLabel>
                <FormControl>
                  {renderFieldInput(
                    field,
                    { value: formField.value as string, onChange: formField.onChange },
                    config.theme
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className={cn(
            'w-full rounded-full py-6 text-lg font-semibold shadow-lg transition-all duration-300',
            config.theme.buttonClass ?? 'bg-primary hover:bg-primary/90 text-primary-foreground'
          )}
        >
          {form.formState.isSubmitting ? labels.submittingButton : labels.submitButton}
        </Button>
      </form>
    </Form>
  )
}
