import { create } from "zustand";
import type { CafeType } from "@/types/models";

export type CafeFilter = "전체" | CafeType | "즐겨찾기";
export type PanelView = "intro" | "detail" | "report";

interface UiState {
  filter: CafeFilter;
  panelOpen: boolean;
  panelView: PanelView;
  reportPinActive: boolean;
  reportPin: { latitude: number; longitude: number } | null;
  setFilter: (filter: CafeFilter) => void;
  setPanelOpen: (open: boolean) => void;
  setPanelView: (view: PanelView) => void;
  openIntro: () => void;
  openDetail: () => void;
  startReport: () => void;
  stopReport: () => void;
  setReportPin: (pin: { latitude: number; longitude: number } | null) => void;
}

export const useUiStore = create<UiState>(set => ({
  filter: "전체",
  panelOpen: true,
  panelView: "intro",
  reportPinActive: false,
  reportPin: null,
  setFilter: filter => set({ filter }),
  setPanelOpen: panelOpen => set({ panelOpen }),
  setPanelView: panelView => set({ panelView }),
  openIntro: () => set({ panelOpen: true, panelView: "intro" }),
  openDetail: () => set({ panelOpen: true, panelView: "detail" }),
  startReport: () =>
    set({
      reportPinActive: true,
      panelOpen: true,
      panelView: "report",
      reportPin: null,
    }),
  stopReport: () =>
    set({
      reportPinActive: false,
      reportPin: null,
      panelView: "intro",
      panelOpen: true,
    }),
  setReportPin: reportPin => set({ reportPin }),
}));
