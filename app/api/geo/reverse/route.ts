import { NextRequest, NextResponse } from "next/server";

interface ReverseResult {
  land?: { name?: string; number1?: string; number2?: string };
  region?: {
    area1?: { name?: string; alias?: string };
    area2?: { name?: string };
  };
}

export async function GET(request: NextRequest) {
  const lat = request.nextUrl.searchParams.get("lat");
  const lng = request.nextUrl.searchParams.get("lng");
  const id = process.env.NAVER_CLIENT_ID ?? process.env.NEXT_PUBLIC_NAVER_CLIENT_ID;
  const secret = process.env.NAVER_CLIENT_SECRET;
  if (!id || !secret || !lat || !lng) {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }
  const response = await fetch(
    `https://naveropenapi.apigw.ntruss.com/map-reversegeocode/v2/gc?output=json&orders=roadaddr&coords=${lng},${lat}`,
    {
      headers: {
        "X-NCP-APIGW-API-KEY-ID": id,
        "X-NCP-APIGW-API-KEY": secret,
      },
    },
  );
  if (!response.ok) {
    return NextResponse.json({ error: "역지오코딩 실패" }, { status: 502 });
  }
  const data = await response.json();
  const result = (data.results as ReverseResult[] | undefined)?.[0];
  if (!result) {
    return NextResponse.json({ text: "" });
  }
  const city = result.region?.area1?.alias || result.region?.area1?.name || "";
  const district = result.region?.area2?.name || "";
  const road = result.land?.name || "";
  const number = result.land?.number2
    ? `${result.land.number1}-${result.land.number2}`
    : result.land?.number1 || "";
  return NextResponse.json({
    text: [city, district, road, number].filter(Boolean).join(" "),
  });
}
