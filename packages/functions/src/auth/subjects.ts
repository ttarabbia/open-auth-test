import { createSubjects } from "@openauthjs/openauth/subject"
import { object, string } from "valibot"

export const subjects = createSubjects({
  user: object({
    userId: string(),
    workspaceId: string(),
  }),
})
