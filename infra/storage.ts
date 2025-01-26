export const bucket = new sst.aws.Bucket("MyBucket");

export const secret = {
  GITHUB_CLIENT_ID: new sst.Secret("GithubClientId"),
  GITHUB_CLIENT_SECRET: new sst.Secret("GithubClientSecret")
}
