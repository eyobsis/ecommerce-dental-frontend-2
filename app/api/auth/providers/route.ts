import { env } from "@/config/env";

type SocialProviderKey = "google" | "facebook" | "twitter";

export async function GET() {
  const providers: SocialProviderKey[] = [];

  if (env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET) {
    providers.push("google");
  }

  if (env.FACEBOOK_CLIENT_ID && env.FACEBOOK_CLIENT_SECRET) {
    providers.push("facebook");
  }

  if (env.TWITTER_CLIENT_ID && env.TWITTER_CLIENT_SECRET) {
    providers.push("twitter");
  }

  return Response.json({ providers });
}
