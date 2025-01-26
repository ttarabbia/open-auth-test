/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "open-auth-test",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "aws",
    };
  },
  async run() {
    const { api, auth } = await import("./infra/api");
    const storage = await import("./infra/storage");
    const web = await import("./infra/web")


    return {
      frontend: web.frontend.url,
      MyBucket: storage.bucket.name,
      Auth: auth.url,
      Api: api.url
    };
  },
});
