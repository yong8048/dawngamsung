import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("query") ?? "";
  const id = process.env.NAVER_CLIENT_ID ?? process.env.NEXT_PUBLIC_NAVER_CLIENT_ID;
  const secret = process.env.NAVER_CLIENT_SECRET;
  if (!id || !secret) {
    return NextResponse.json({ error: "네이버 지오코딩 키가 없습니다." }, { status: 500 });
  }
  const response = await fetch(
    `https://naveropenapi.apigw.ntruss.com/map-geocode/v2/geocode?query=${encodeURIComponent(query)}`,
    {
      headers: {
        "X-NCP-APIGW-API-KEY-ID": id,
        "X-NCP-APIGW-API-KEY": secret,
      },
    },
  );
  if (!response.ok) {
    return NextResponse.json({ error: "지오코딩 실패" }, { status: 502 });
  }
  const data = await response.json();
  if (data.status !== "OK" || !data.addresses?.[0]) {
    return NextResponse.json(null);
  }
  return NextResponse.json({
    longitude: Number(data.addresses[0].x),
    latitude: Number(data.addresses[0].y),
  });
}
