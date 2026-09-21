export {};

declare global {
  interface Window {
    naver?: {
      maps: {
        Map: new (el: string | HTMLElement, options: Record<string, unknown>) => NaverMap;
        LatLng: new (lat: number, lng: number) => NaverLatLng;
        Marker: new (options: Record<string, unknown>) => NaverMarker;
        Size: new (width: number, height: number) => unknown;
        Point: new (x: number, y: number) => unknown;
        Event: {
          addListener: (target: unknown, event: string, handler: (...args: unknown[]) => void) => unknown;
          removeListener: (listener: unknown) => void;
        };
      };
    };
  }
}

export interface NaverLatLng {
  lat: () => number;
  lng: () => number;
  _lat: number;
  _lng: number;
}

export interface NaverBounds {
  _min: { _lat: number; _lng: number };
  _max: { _lat: number; _lng: number };
}

export interface NaverMap {
  getCenter: () => NaverLatLng;
  getBounds: () => NaverBounds;
  getZoom: () => number;
  panTo: (latlng: NaverLatLng) => void;
}

export interface NaverMarker {
  setMap: (map: NaverMap | null) => void;
  setVisible: (visible: boolean) => void;
  setPosition: (latlng: NaverLatLng) => void;
  data?: import("./models").Store;
}
