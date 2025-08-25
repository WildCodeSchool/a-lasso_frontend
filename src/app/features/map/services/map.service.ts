import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class MapService {
  async geocodeCity(cityName: string): Promise<{ lat: number; lon: number } | null> {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cityName)}`);
      const results = await response.json();
      if (results.length > 0) {
        return {
          lat: parseFloat(results[0].lat),
          lon: parseFloat(results[0].lon),
        };
      }
      return null;
    } catch (error) {
      console.error('Erreur géocodage : ', error);
      return null;
    }
  }
}
