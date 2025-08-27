import { z } from "zod"
import isEmail from "validator/lib/isEmail"

export const accountEmailSchema = z
  .string()
  .optional()
  .refine((val) => (val ? isEmail(val) : true), {
    message: "Invalid email address"
  })

export const filtersSchema = z.object({
  emailIdFilters: z.array(z.string()).optional(),
  accountEmail: accountEmailSchema
})

export type FiltersFormData = z.infer<typeof filtersSchema>
