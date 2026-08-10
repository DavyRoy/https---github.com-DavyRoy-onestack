import { prisma } from "./prisma";

const FCM_URL = "https://fcm.googleapis.com/v1/projects/{PROJECT_ID}/messages:send";

// Get OAuth2 access token from service account credentials
async function getFcmAccessToken(): Promise<string | null> {
  const credJson = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!credJson) return null;
  try {
    const cred = JSON.parse(credJson);
    // Use JWT assertion flow (RS256)
    const { SignJWT, importPKCS8 } = await import("jose");
    const now = Math.floor(Date.now() / 1000);
    const privateKey = await importPKCS8(cred.private_key, "RS256");
    const jwt = await new SignJWT({
      iss: cred.client_email,
      sub: cred.client_email,
      aud: "https://oauth2.googleapis.com/token",
      scope: "https://www.googleapis.com/auth/firebase.messaging",
      iat: now,
      exp: now + 3600,
    })
      .setProtectedHeader({ alg: "RS256" })
      .sign(privateKey);

    const res = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
        assertion: jwt,
      }),
    });
    const data = await res.json();
    return data.access_token ?? null;
  } catch {
    return null;
  }
}

export async function sendPushToUser(
  userId: string,
  notification: { title: string; body: string },
  data?: Record<string, string>
) {
  const projectId = process.env.FCM_PROJECT_ID;
  if (!projectId) return;

  const accessToken = await getFcmAccessToken();
  if (!accessToken) return;

  const tokens = await prisma.pushToken.findMany({ where: { userId } });
  if (!tokens.length) return;

  const url = FCM_URL.replace("{PROJECT_ID}", projectId);

  await Promise.allSettled(
    tokens.map((t) =>
      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          message: {
            token: t.token,
            notification,
            data: Object.fromEntries(
              Object.entries(data ?? {}).map(([k, v]) => [k, String(v)])
            ),
            apns: {
              payload: { aps: { sound: "default", badge: 1 } },
            },
          },
        }),
      })
    )
  );
}
