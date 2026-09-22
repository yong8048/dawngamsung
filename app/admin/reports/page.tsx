"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { StoreEditor } from "@/components/admin/store-editor";
import { useReports } from "@/hooks/use-reports";
import { createStore } from "@/lib/firebase/stores";
import { deleteReport } from "@/lib/firebase/reports";
import { uploadStoreImages } from "@/lib/firebase/images";
import { geocodeAddress } from "@/lib/naver";
import { useAdminReportStore } from "@/store/admin-report-store";
import type { CafeType, StoreInput } from "@/types/models";

export default function AdminReportsPage() {
  const { reports, refetch } = useReports();
  const { report, setReport } = useAdminReportStore();
  const queryClient = useQueryClient();
  const pending = reports.filter(item => item.status === "pending");

  const toInput = (): StoreInput | undefined => {
    if (!report) return undefined;
    return {
      name: report.name,
      type: (report.type || "일반") as CafeType,
      address: report.address,
      latitude: report.latitude,
      longitude: report.longitude,
      phone: report.phone,
      parking: report.parking,
      toilet: report.toilet,
      googlePlaceId: "",
    };
  };

  const [note] = useState("");

  return (
    <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[280px_1fr]">
      <aside className="rounded-3xl border border-line bg-panel p-4">
        <h2 className="mb-3 font-semibold">대기 제보 {pending.length}</h2>
        <div className="space-y-2">
          {pending.map(item => (
            <button
              key={item.id}
              onClick={() => setReport(item)}
              className={`w-full rounded-2xl px-3 py-3 text-left ${
                report?.id === item.id ? "bg-amber text-night" : "bg-panel-2"
              }`}
            >
              <p className="font-medium">{item.name || "이름 없음"}</p>
              <p className="text-xs opacity-70">{item.address || "주소 없음"}</p>
            </button>
          ))}
          {!pending.length && <p className="text-sm text-muted">대기 중인 제보가 없습니다.</p>}
        </div>
      </aside>

      <section>
        {!report ? (
          <div className="flex h-80 items-center justify-center rounded-3xl border border-line text-muted">
            제보를 선택해 주세요
          </div>
        ) : (
          <StoreEditor
            key={report.id}
            initial={toInput()}
            submitLabel="승인하고 매장 등록"
            extra={
              <div className="mt-4 rounded-2xl bg-panel-2 p-4 text-sm text-muted">
                기타 제보: {report.additional || "없음"}
                {note}
              </div>
            }
            onSubmit={async (input, files) => {
              let next = input;
              if (!next.latitude || !next.longitude) {
                const geo = await geocodeAddress(next.address);
                if (!geo) throw new Error("좌표 없음");
                next = { ...next, ...geo };
              }
              const id = await createStore(next);
              if (files.length) await uploadStoreImages(id, files);
              await deleteReport(report.id);
              setReport(null);
              refetch();
              queryClient.invalidateQueries({ queryKey: ["stores"] });
            }}
          />
        )}
        {report && (
          <button
            className="mt-3 text-sm text-danger"
            onClick={async () => {
              await deleteReport(report.id);
              setReport(null);
              refetch();
              toast.success("제보를 반려했습니다.");
            }}
          >
            반려 / 삭제
          </button>
        )}
      </section>
    </div>
  );
}
