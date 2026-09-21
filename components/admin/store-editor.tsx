"use client";

import { useState } from "react";
import { toast } from "sonner";
import { OptionPills } from "@/components/option-pills";
import { STORE_FIELDS } from "@/lib/constants";
import { geocodeAddress } from "@/lib/naver";
import { emptyStoreInput, type CafeType, type Parking, type StoreInput, type Toilet } from "@/types/models";

export const StoreEditor = ({
  initial,
  submitLabel,
  extra,
  onSubmit,
}: {
  initial?: StoreInput;
  submitLabel: string;
  extra?: React.ReactNode;
  onSubmit: (input: StoreInput, files: File[]) => Promise<void>;
}) => {
  const [form, setForm] = useState<StoreInput>(initial ?? emptyStoreInput());
  const [files, setFiles] = useState<File[]>([]);
  const [pending, setPending] = useState(false);
  const [searched, setSearched] = useState(Boolean(initial?.latitude && initial?.longitude));

  const search = async () => {
    const geo = await geocodeAddress(form.address);
    if (!geo) {
      toast.error("주소를 찾지 못했습니다.");
      return;
    }
    setForm({ ...form, latitude: geo.latitude, longitude: geo.longitude });
    setSearched(true);
    toast.success("좌표를 채웠습니다.");
  };

  const save = async () => {
    if (!form.name || !form.address) {
      toast.error("지점명과 주소는 필수입니다.");
      return;
    }
    if (!searched && !form.latitude) {
      toast.error("주소 검색으로 좌표를 확인해 주세요.");
      return;
    }
    setPending(true);
    try {
      await onSubmit(form, files);
      toast.success("저장했습니다.");
      setFiles([]);
    } catch (error) {
      console.error(error);
      toast.error("저장에 실패했습니다.");
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-panel p-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Field label={STORE_FIELDS.name.title}>
          <input
            className="admin-input"
            value={form.name}
            placeholder={STORE_FIELDS.name.placeholder}
            onChange={e => setForm({ ...form, name: e.target.value })}
          />
        </Field>
        <Field label={STORE_FIELDS.type.title}>
          <OptionPills
            value={form.type}
            options={STORE_FIELDS.type.property}
            onChange={value => setForm({ ...form, type: value as CafeType })}
          />
        </Field>
        <Field label={STORE_FIELDS.address.title}>
          <div className="flex gap-2">
            <input
              className="admin-input flex-1"
              value={form.address}
              placeholder={STORE_FIELDS.address.placeholder}
              onChange={e => setForm({ ...form, address: e.target.value, latitude: 0, longitude: 0 })}
            />
            <button onClick={search} className="rounded-xl bg-white/10 px-3">
              검색
            </button>
          </div>
        </Field>
        <Field label="좌표">
          <p className="text-sm text-muted">
            {form.latitude && form.longitude ? `${form.latitude}, ${form.longitude}` : "주소 검색 후 자동 입력"}
          </p>
        </Field>
        <Field label={STORE_FIELDS.phone.title}>
          <input
            className="admin-input"
            value={form.phone}
            placeholder={STORE_FIELDS.phone.placeholder}
            onChange={e => setForm({ ...form, phone: e.target.value })}
          />
        </Field>
        <Field label="Google Place ID">
          <input
            className="admin-input"
            value={form.googlePlaceId ?? ""}
            placeholder="나중에 구글맵 연동용 (선택)"
            onChange={e => setForm({ ...form, googlePlaceId: e.target.value })}
          />
        </Field>
        <Field label={STORE_FIELDS.parking.title}>
          <OptionPills
            value={form.parking}
            options={STORE_FIELDS.parking.property}
            allowEmpty
            onChange={value => setForm({ ...form, parking: value as Parking })}
          />
        </Field>
        <Field label={STORE_FIELDS.toilet.title}>
          <OptionPills
            value={form.toilet}
            options={STORE_FIELDS.toilet.property}
            allowEmpty
            onChange={value => setForm({ ...form, toilet: value as Toilet })}
          />
        </Field>
      </div>

      <div className="mt-5">
        <p className="mb-2 text-xs text-muted">매장 사진</p>
        <input type="file" multiple onChange={e => setFiles(Array.from(e.target.files ?? []))} />
        <div className="mt-3 flex flex-wrap gap-2">
          {files.map(file => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={file.name} src={URL.createObjectURL(file)} alt="" className="h-20 w-20 rounded-lg object-cover" />
          ))}
        </div>
      </div>
      {extra}
      <button
        disabled={pending}
        onClick={save}
        className="mt-6 rounded-2xl bg-amber px-6 py-3 font-semibold text-night disabled:opacity-60"
      >
        {pending ? "저장 중..." : submitLabel}
      </button>
    </div>
  );
};

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <label className="block">
    <span className="mb-1 block text-xs text-muted">{label}</span>
    {children}
  </label>
);
