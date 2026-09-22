export const FILTERS = ["전체", "일반", "무인", "즐겨찾기"] as const;

export const STORE_FIELDS = {
  name: { title: "지점명", placeholder: "만월경 위례점" },
  type: { title: "카페 타입", property: ["일반", "무인"] as const },
  address: { title: "주소", placeholder: "주소 입력" },
  latitude: { title: "위도", placeholder: "주소 검색 시 자동 등록" },
  longitude: { title: "경도", placeholder: "주소 검색 시 자동 등록" },
  phone: { title: "전화번호", placeholder: "- 포함 입력" },
  parking: { title: "주차", property: ["가능", "불가"] as const },
  toilet: { title: "화장실", property: ["있음", "없음"] as const },
} as const;

export const UNMANNED_BRANDS = ["만월경", "데이롱", "커피에반하다", "카페일분", "프리헷", "터치카페", "나우커피"];
export const GENERAL_BRANDS = ["The november", "탐앤탐스", "할리스", "엔젤리너스", "파스쿠찌", "투썸플레이스", "스타벅스"];
