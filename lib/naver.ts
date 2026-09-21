export interface GeoLocation {
  latitude: number;
  longitude: number;
}

export interface ReverseAddress {
  text: string;
}

export const geocodeAddress = async (address: string): Promise<GeoLocation | null> => {
  const response = await fetch(`/api/geo/geocode?query=${encodeURIComponent(address)}`);
  if (!response.ok) return null;
  return response.json();
};

export const reverseGeocode = async (latitude: number, longitude: number): Promise<string | null> => {
  const response = await fetch(`/api/geo/reverse?lat=${latitude}&lng=${longitude}`);
  if (!response.ok) return null;
  const data = (await response.json()) as ReverseAddress;
  return data.text || null;
};
