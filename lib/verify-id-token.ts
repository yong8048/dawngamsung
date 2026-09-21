import { firebaseConfig } from "@/lib/config";

interface LookupResponse {
  users?: Array<{
    localId: string;
    email?: string;
    displayName?: string;
  }>;
}

export const verifyIdToken = async (idToken: string) => {
  if (!firebaseConfig.apiKey) throw new Error("Firebase API 키가 없습니다.");
  const response = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${firebaseConfig.apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    },
  );
  if (!response.ok) return null;
  const data = (await response.json()) as LookupResponse;
  return data.users?.[0] ?? null;
};

export const getBearerToken = (request: Request) => {
  const header = request.headers.get("authorization") ?? "";
  if (!header.startsWith("Bearer ")) return null;
  return header.slice("Bearer ".length);
};
