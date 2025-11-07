import { z } from 'zod'

export const userSchema = z.object({
  id: z.string(),
  clerkUserId: z.string(),
  email: z.string().email(),
  name: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const updateUserSchema = z.object({
  name: z.string().min(2).max(50).optional(),
  email: z.string().email().optional(),
})

export type User = z.infer<typeof userSchema>
export type UpdateUserInput = z.infer<typeof updateUserSchema>
