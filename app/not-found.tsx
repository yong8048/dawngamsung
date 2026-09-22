import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-night text-mist">
      <p className="text-amber">404</p>
      <h1 className="text-2xl font-semibold">페이지를 찾을 수 없습니다</h1>
      <Link href="/" className="rounded-full bg-amber px-4 py-2 text-night">
        지도로 돌아가기
      </Link>
    </div>
  );
}
