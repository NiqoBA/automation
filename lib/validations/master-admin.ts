import { z } from 'zod'

export const inviteClientSchema = z.object({
  email: z.string().email('Email inválido'),
  companyName: z.string().min(2, 'El nombre de la empresa debe tener al menos 2 caracteres'),
  plan: z.enum(['Starter', 'Professional', 'Enterprise']).optional(),
  notes: z.string().optional(),
})

export type InviteClientInput = z.infer<typeof inviteClientSchema>
