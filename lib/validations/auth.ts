import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
})

export const registerSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  full_name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  phone: z.string().optional(),
  company_name: z.string().min(2, 'El nombre de la empresa es requerido'),
  employee_count: z.enum(['1-10', '11-50', '51-200', '201-1000', '1000+'], {
    errorMap: () => ({ message: 'Selecciona una opción válida' }),
  }),
  rut: z.string().regex(/^\d{1,8}-\d{1}$/, 'RUT inválido (formato: 12345678-9)'),
  country: z.string().default('Uruguay'),
})

export const inviteUserSchema = z.object({
  email: z.string().email('Email inválido'),
  role: z.enum(['org_admin', 'org_member']),
})
