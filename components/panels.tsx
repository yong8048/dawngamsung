"use client";

import { IntroPanel } from "@/components/intro-panel";
import { ReportForm } from "@/components/report-form";
import { StoreDetail } from "@/components/store-detail";
import { useUiStore } from "@/store/ui-store";

export const SidePanel = () => {
  const { panelOpen, panelView, setPanelOpen } = useUiStore();

  return (
    <>
      <aside
        className={`glass-panel absolute top-14 bottom-0 z-20 hidden w-[400px] overflow-hidden transition-transform duration-500 sm:top-16 sm:block ${
          panelOpen ? "translate-x-0" : "-translate-x-[110%]"
        }`}
      >
        {panelView === "report" ? <ReportForm /> : panelView === "detail" ? <StoreDetail /> : <IntroPanel />}
      </aside>
      {panelOpen && panelView === "detail" && (
        <button
          className="absolute top-24 left-[400px] z-20 hidden h-11 w-10 items-center justify-center rounded-r-xl border border-l-0 border-line bg-panel sm:flex"
          onClick={() => setPanelOpen(false)}
        >
          ‹
        </button>
      )}
    </>
  );
};

export const BottomSheet = () => {
  const { panelOpen, panelView, setPanelOpen } = useUiStore();
  const expanded = panelOpen && panelView !== "intro";

  return (
    <div
      className={`glass-panel absolute right-0 bottom-0 left-0 z-20 overflow-hidden rounded-t-3xl sm:hidden ${
        expanded ? "h-[72%]" : panelOpen ? "h-[210px]" : "h-16"
      }`}
    >
      <button className="flex w-full justify-center py-2" onClick={() => setPanelOpen(!panelOpen)}>
        <span className="h-1 w-12 rounded-full bg-line" />
      </button>
      <div className="h-[calc(100%-20px)] overflow-y-auto">
        {panelView === "report" ? <ReportForm /> : panelView === "detail" ? <StoreDetail /> : <IntroPanel />}
      </div>
    </div>
  );
};
