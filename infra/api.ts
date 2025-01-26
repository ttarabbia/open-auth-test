import { secret, bucket } from "./storage";

export const api = new sst.aws.Function("api", {
  url: true,
  link: [bucket, secret],
  handler: "packages/functions/src/api.handler"
});

export const auth = new sst.aws.Auth("MyAuth", {
  issuer: "packages/functions/src/auth/index.handler"
})
// export const auth = new sst.aws.Function("auth", {
//   url: true,
//   link: [secret],
//   handler: "packages/functions/src/auth.handler"
// })
