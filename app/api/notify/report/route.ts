import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const serviceId = process.env.EMAILJS_SERVICE_ID;
  const templateId = process.env.EMAILJS_TEMPLATE_ID;
  const publicKey = process.env.EMAILJS_PUBLIC_KEY;
  if (!serviceId || !templateId || !publicKey) {
    return NextResponse.json({ skipped: true });
  }
  const body = (await request.json()) as { storeName?: string };
  const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      service_id: serviceId,
      template_id: templateId,
      user_id: publicKey,
      template_params: { storeName: body.storeName ?? "" },
    }),
  });
  if (!response.ok) {
    return NextResponse.json({ error: "메일 발송 실패" }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
