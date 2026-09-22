import { create } from "zustand";
import type { Report } from "@/types/models";

interface AdminReportState {
  report: Report | null;
  setReport: (report: Report | null) => void;
}

export const useAdminReportStore = create<AdminReportState>(set => ({
  report: null,
  setReport: report => set({ report }),
}));
