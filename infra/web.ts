import { api, auth } from "./api"
import { bucket } from "./storage";

const region = aws.getRegionOutput().name;
// console.log(auth.url)
// console.log(api.url)

export const frontend = new sst.aws.StaticSite("Frontend", {
  path: "packages/frontend",
  build: {
    output: "dist",
    command: "npm run build",
  },
  environment: {
    VITE_REGION: region,
    VITE_API_URL: api.url,
    VITE_BUCKET: bucket.name,
    VITE_AUTH_URL: auth.url,
  }
})
