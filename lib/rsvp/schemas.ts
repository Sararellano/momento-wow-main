// Dynamic Zod schema factory for RSVP forms
import { z } from 'zod'
import type { RSVPFieldConfig } from './types'

export function createRSVPSchema(fields: RSVPFieldConfig[]) {
  const shape: Record<string, z.ZodTypeAny> = {}

  for (const field of fields) {
    let fieldSchema: z.ZodTypeAny

    switch (field.type) {
      case 'email':
        fieldSchema = z.string().email('Introduce un email válido')
        break
      case 'number':
        fieldSchema = z.coerce.number()
        if (field.validation?.min !== undefined) fieldSchema = (fieldSchema as z.ZodNumber).min(field.validation.min)
        if (field.validation?.max !== undefined) fieldSchema = (fieldSchema as z.ZodNumber).max(field.validation.max)
        break
      case 'select':
      case 'radio':
        if (field.options?.length) {
          fieldSchema = z.enum(field.options.map(o => o.value) as [string, ...string[]])
        } else {
          fieldSchema = z.string()
        }
        break
      default:
        fieldSchema = z.string()
        if (field.validation?.min) fieldSchema = (fieldSchema as z.ZodString).min(field.validation.min, 'Campo demasiado corto')
        if (field.validation?.max) fieldSchema = (fieldSchema as z.ZodString).max(field.validation.max, 'Campo demasiado largo')
    }

    if (field.required) {
      if (field.type === 'text' || field.type === 'email' || field.type === 'textarea') {
        fieldSchema = (fieldSchema as z.ZodString).min(1, 'Este campo es obligatorio')
      }
    } else {
      fieldSchema = fieldSchema.optional().or(z.literal(''))
    }

    shape[field.name] = fieldSchema
  }

  return z.object(shape)
}
