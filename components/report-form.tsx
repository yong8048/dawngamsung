"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { STORE_FIELDS } from "@/lib/constants";
import { createReport } from "@/lib/firebase/reports";
import { reverseGeocode } from "@/lib/naver";
import { isFirebaseConfigured } from "@/lib/config";
import { useUiStore } from "@/store/ui-store";
import { emptyReportInput, type ReportInput } from "@/types/models";
import { OptionPills } from "@/components/option-pills";

export const ReportForm = () => {
  const { reportPin, stopReport } = useUiStore();
  const [form, setForm] = useState<ReportInput>(emptyReportInput());
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (!reportPin) return;
    setForm(prev => ({ ...prev, latitude: reportPin.latitude, longitude: reportPin.longitude }));
  }, [reportPin]);

  const submit = async () => {
    if (!form.latitude || !form.longitude) {
      toast.error("지도를 눌러 위치를 찍어 주세요.");
      return;
    }
    if (!form.name || !form.type) {
      toast.error("지점명과 카페 타입은 필수입니다.");
      return;
    }
    if (!isFirebaseConfigured) {
      toast.error("Firebase가 연결되면 제보가 저장됩니다.");
      return;
    }
    setPending(true);
    try {
      const address = await reverseGeocode(form.latitude, form.longitude);
      if (!address) {
        toast.error("건물 위에 핀을 올려 주세요.");
        return;
      }
      await createReport({ ...form, address });
      fetch("/api/notify/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ storeName: form.name }),
      }).catch(() => undefined);
      toast.success("제보 감사합니다. 검토 후 반영됩니다.");
      stopReport();
    } catch (error) {
      console.error(error);
      toast.error("제보에 실패했습니다.");
    } finally {
      setPending(false);
    }
  };

  return (
    <section className="h-full overflow-y-auto px-5 py-6">
      <div className="mb-5 flex items-start justify-between">
        <div>
          <p className="text-xs tracking-[0.2em] text-amber">REPORT</p>
          <h2 className="mt-1 text-2xl font-semibold">매장 제보</h2>
        </div>
        <button onClick={stopReport} className="text-sm text-muted">
          닫기
        </button>
      </div>
      <p className="mb-5 rounded-2xl border border-amber/20 bg-amber/10 px-4 py-3 text-sm text-amber">
        지도를 눌러 매장 위치를 먼저 찍어 주세요.
        {reportPin ? " 위치가 선택되었습니다." : ""}
      </p>

      <div className="space-y-3">
        <Field label="지점명 *">
          <input
            className="h-10 w-full rounded-xl border border-white/10 bg-night px-3"
            placeholder={STORE_FIELDS.name.placeholder}
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
          />
        </Field>
        <Field label="카페 타입 *">
          <OptionPills
            value={form.type}
            options={["일반", "무인"]}
            onChange={value => setForm({ ...form, type: value as ReportInput["type"] })}
          />
        </Field>
        <Field label="전화">
          <input
            className="h-10 w-full rounded-xl border border-white/10 bg-night px-3"
            placeholder={STORE_FIELDS.phone.placeholder}
            value={form.phone}
            onChange={e => setForm({ ...form, phone: e.target.value })}
          />
        </Field>
        <Field label="주차">
          <OptionPills
            value={form.parking}
            options={["가능", "불가"]}
            allowEmpty
            onChange={value => setForm({ ...form, parking: value as ReportInput["parking"] })}
          />
        </Field>
        <Field label="화장실">
          <OptionPills
            value={form.toilet}
            options={["있음", "없음"]}
            allowEmpty
            onChange={value => setForm({ ...form, toilet: value as ReportInput["toilet"] })}
          />
        </Field>
        <Field label="기타">
          <textarea
            className="h-24 w-full rounded-xl border border-white/10 bg-night p-3"
            value={form.additional}
            onChange={e => setForm({ ...form, additional: e.target.value })}
          />
        </Field>
      </div>

      <ul className="mt-4 space-y-1 text-xs text-muted">
        <li>관리자 검토 후 지도에 올라갑니다.</li>
        <li>정확한 이름과 위치를 적어 주세요.</li>
      </ul>

      <button
        disabled={pending}
        onClick={submit}
        className="mt-6 w-full rounded-2xl bg-amber py-3 font-semibold text-night disabled:opacity-60"
      >
        {pending ? "보내는 중..." : "제보하기"}
      </button>
    </section>
  );
};

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <label className="block">
    <span className="mb-1 block text-xs text-muted">{label}</span>
    {children}
  </label>
);
