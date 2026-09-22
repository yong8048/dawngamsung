import { NextRequest, NextResponse } from "next/server";
import { isAdminUid } from "@/lib/admin";
import { getBearerToken, verifyIdToken } from "@/lib/verify-id-token";

export async function GET(request: NextRequest) {
  const token = getBearerToken(request);
  if (!token) {
    return NextResponse.json({ isAdmin: false }, { status: 401 });
  }
  const user = await verifyIdToken(token);
  if (!user) {
    return NextResponse.json({ isAdmin: false }, { status: 401 });
  }
  return NextResponse.json({
    isAdmin: isAdminUid(user.localId),
    uid: user.localId,
  });
}
