export type MapDisplayType = {
  activities: boolean;
  associations: boolean;
};

type MyCityClickedEvent = { city: string; coords: { lat: number; lon: number } };
