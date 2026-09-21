"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";

const links = [
  { href: "/admin", label: "대시보드" },
  { href: "/admin/reports", label: "제보 리스트" },
  { href: "/admin/upload", label: "매장 추가" },
  { href: "/admin/modify", label: "정보 수정" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setChecked(true), 800);
    return () => clearTimeout(timer);
  }, [user, isAdmin]);

  useEffect(() => {
    if (!checked) return;
    if (!user || !isAdmin) {
      router.replace("/");
    }
  }, [checked, isAdmin, router, user]);

  if (!checked || !isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-night text-muted">
        관리자 권한을 확인하는 중...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-night text-mist">
      <header className="flex items-center gap-6 border-b border-white/10 px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber text-night">✦</span>
          <span className="font-semibold">새벽 감성 어드민</span>
        </Link>
        <nav className="flex gap-2 text-sm">
          {links.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-full px-3 py-1.5 ${
                pathname === link.href ? "bg-amber text-night" : "text-muted hover:text-mist"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-3 text-sm">
          <span>{user?.name}</span>
          <button onClick={logout} className="text-muted">
            로그아웃
          </button>
        </div>
      </header>
      <main className="p-6">{children}</main>
    </div>
  );
}
