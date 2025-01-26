import { issuer } from "@openauthjs/openauth"
// import { GithubProvider } from "@openauthjs/openauth/provider/github"
import { PasswordProvider } from "@openauthjs/openauth/provider/password"
import { PasswordUI } from "@openauthjs/openauth/ui/password"
import { CodeUI } from "@openauthjs/openauth/ui/code"
// import { Resource } from "sst"
import { subjects } from "./subjects"
import { MemoryStorage } from "@openauthjs/openauth/storage/memory"
import { handle } from "hono/aws-lambda"
import { CodeProvider } from "@openauthjs/openauth/provider/code"
import { THEME_SST, THEME_TERMINAL, THEME_VERCEL } from "@openauthjs/openauth/ui/theme"
// import { secret } from "../../../../infra/storage"


async function getUser(email: string) {
  console.log("getUserCalled")
  throw new Error;
  // return { userId: email, workspaceId: "abc" }
}

const app = issuer({
  theme: THEME_TERMINAL,
  subjects,
  storage: MemoryStorage(),
  providers: {
    // github: GithubProvider({
    //   clientID: secret.GITHUB_CLIENT_ID,
    //   clientSecret: secret.GITHUB_CLIENT_SECRET,
    //   scopes: ["user:email"],
    // }),
    code: CodeProvider(
      CodeUI({
        copy: {
          code_info: "We'll send a pin code to your email THEMEEE"
        },
        length: 4,
        sendCode: (claims, code) => console.log(claims, code)
      }),
    ),
    password: PasswordProvider(
      PasswordUI({
        sendCode: async (email, code) => {
          console.log(email, code)
        }
      }),
    )
  },
  success: async (ctx, value) => {
    let userId: string;
    if (value.provider === "password") {
      console.log(value.email)
      userId = (await getUser(value.email)).userId
    }
    // if (value.provider === "github") {
    //   console.log(value.tokenset.access)
    //   userId = (await getUser(String(value.tokenset))).userId
    // }
    return ctx.subject("user", {
      userId,
      workspaceId: 'workspace_123'
    })
  },
});



export const handler = handle(app)
