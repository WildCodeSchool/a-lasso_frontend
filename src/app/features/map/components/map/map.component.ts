import { Component, OnInit } from '@angular/core';
import maplibregl from 'maplibre-gl';
import { environmentSecret } from 'src/environments/environment.secret';

@Component({
  selector: 'app-map',
  imports: [],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss',
})
export class MapComponent implements OnInit {
  private _mapKey: string = environmentSecret.apiMapKey;

  ngOnInit(): void {
    const map = new maplibregl.Map({
      container: 'map', // ID de l'élément HTML
      style: `https://api.maptiler.com/maps/streets/style.json?key=${this._mapKey}`,
      center: [2.3522, 48.8566], // Coordonnées (longitude, latitude)
      zoom: 10,
    });

    map.addControl(new maplibregl.NavigationControl());
  }
}
