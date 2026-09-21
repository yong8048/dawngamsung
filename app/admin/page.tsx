"use client";

import { Doughnut } from "react-chartjs-2";
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import { useAdminStats } from "@/hooks/use-reports";
import { useStores } from "@/hooks/use-stores";
import { GENERAL_BRANDS, UNMANNED_BRANDS } from "@/lib/constants";

ChartJS.register(ArcElement, Tooltip, Legend);

const palette = ["#E8B86D", "#5B8CFF", "#7DCEA0", "#C4923A", "#F07178", "#9AA3BB", "#D4A5A5", "#555"];

export default function AdminDashboardPage() {
  const { stores } = useStores();
  const { userCount, reportCount } = useAdminStats();
  const unmanned = stores.filter(store => store.type === "무인").length;
  const general = stores.filter(store => store.type === "일반").length;

  const brandData = (brands: string[], all: number) => {
    const counts = brands.map(brand => stores.filter(store => store.name.includes(brand)).length);
    const rest = Math.max(all - counts.reduce((sum, value) => sum + value, 0), 0);
    return { labels: [...brands, "기타"], data: [...counts, rest] };
  };

  const unmannedBrand = brandData(UNMANNED_BRANDS, unmanned);
  const generalBrand = brandData(GENERAL_BRANDS, general);

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="mb-6 text-2xl font-semibold">대시보드</h1>
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <Stat label="등록 매장" value={`${stores.length}곳`} />
        <Stat label="로그인 사용자" value={`${userCount}명`} />
        <Stat label="대기 제보" value={`${reportCount}건`} />
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <ChartCard title={`전체 ${stores.length}`} labels={["무인", "일반"]} data={[unmanned, general]} />
        <ChartCard title={`무인 ${unmanned}`} labels={unmannedBrand.labels} data={unmannedBrand.data} />
        <ChartCard title={`일반 ${general}`} labels={generalBrand.labels} data={generalBrand.data} />
      </div>
    </div>
  );
}

const Stat = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-3xl border border-white/10 bg-panel p-5">
    <p className="text-sm text-muted">{label}</p>
    <p className="mt-2 text-3xl font-semibold text-amber">{value}</p>
  </div>
);

const ChartCard = ({ title, labels, data }: { title: string; labels: string[]; data: number[] }) => (
  <div className="rounded-3xl border border-white/10 bg-panel p-5">
    <h2 className="mb-4 text-center">{title}</h2>
    <Doughnut
      data={{
        labels,
        datasets: [
          {
            data,
            backgroundColor: palette,
            borderColor: ["#12182B"],
            borderWidth: 2,
          },
        ],
      }}
      options={{
        plugins: {
          legend: { labels: { color: "#9AA3BB" } },
        },
      }}
    />
  </div>
);
