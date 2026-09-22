"use client";

import { useUpdateMeta } from "@/hooks/use-stores";

const lines = [
  "새벽인데 커피가 땡길 때",
  "밤산책 하다 따뜻한 한 잔",
  "편의점 말고 매장에서",
  "눈치 없이 카공하고 싶을 때",
];

export const IntroPanel = () => {
  const { data } = useUpdateMeta();

  return (
    <section className="relative flex h-full flex-col overflow-hidden bg-panel">
      <div className="px-6 pt-10">
        <p className="text-xs tracking-[0.22em] text-muted">24HOUR CAFE</p>
        <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-tight">
          꺼지지 않는
          <br />
          도시의 불빛
        </h2>
        <p className="mt-3 text-sm leading-6 text-muted">
          올빼미를 위한 24시 카페만 모았습니다.
          <br />
          지도를 옮기고, 가까운 새벽을 고르세요.
        </p>
      </div>

      <ul className="mt-8 space-y-2 px-6 text-sm text-mist">
        {lines.map(line => (
          <li key={line} className="rounded-2xl border border-line bg-night px-4 py-3">
            # {line}
          </li>
        ))}
      </ul>

      <div className="mt-auto px-6 pb-6 text-[11px] leading-5 text-muted">
        <p>sylee8048@gmail.com</p>
        {data?.ymd && <p>Data update : {data.ymd}</p>}
      </div>
    </section>
  );
};
