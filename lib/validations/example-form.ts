import { z } from 'zod'
import { emailSchema, nameSchema } from './common'

export const exampleFormSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  age: z.number().min(18, 'Must be at least 18').max(120, 'Invalid age'),
  category: z.string().min(1, 'Please select a category'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  terms: z.boolean().refine((val) => val === true, {
    message: 'You must accept the terms and conditions',
  }),
})

export type ExampleFormInput = z.infer<typeof exampleFormSchema>
