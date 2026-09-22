"use client";

import { useUiStore } from "@/store/ui-store";

export const ReportButton = () => {
  const { reportPinActive, panelOpen, panelView, startReport, stopReport } = useUiStore();
  const raised = panelOpen && panelView !== "report";

  return (
    <button
      onClick={() => (reportPinActive ? stopReport() : startReport())}
      className={`absolute z-20 rounded-full px-4 py-3 text-sm font-semibold shadow-xl sm:right-5 sm:bottom-6 right-3 ${
        raised ? "bottom-[230px]" : "bottom-6"
      } sm:bottom-6 ${reportPinActive ? "bg-danger text-white" : "bg-amber text-night"}`}
    >
      {reportPinActive ? "제보 취소" : "제보하기"}
    </button>
  );
};
