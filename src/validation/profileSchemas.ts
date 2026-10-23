import { registerSchema } from '@/validation/authSchemas'

export const profileSchema = registerSchema.pick([
  'firstName',
  'lastName',
  'email',
  'phone',
  'province',
  'bio',
])