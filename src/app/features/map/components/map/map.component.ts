import { Component, Input, OnInit, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import maplibregl from 'maplibre-gl';
import { Activity } from 'src/app/features/activity/models/activity.model';
import { environmentSecret } from 'src/environments/environment.secret';
import { Observable, Subscription } from 'rxjs';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { MapDisplayType } from '../../models/map';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  imports: [FormsModule, CheckboxModule],
  styleUrl: './map.component.scss',
})
export class MapComponent implements OnInit, OnChanges, OnDestroy {
  @Input() filteredActivities$!: Observable<Activity[]>;

  private _mapKey = environmentSecret.apiMapKey;
  private _map!: maplibregl.Map;
  private _activityMarkers: maplibregl.Marker[] = [];
  private _associationMarkers: maplibregl.Marker[] = [];
  private _activitySub: Subscription | null = null;

  mapDisplay: MapDisplayType = { activities: true, associations: true };

  ngOnInit(): void {
    this._map = new maplibregl.Map({
      container: 'map',
      style: `https://api.maptiler.com/maps/streets/style.json?key=${this._mapKey}`,
      center: [2.2137, 46.6034],
      zoom: 5,
    });

    this._map.addControl(new maplibregl.NavigationControl());
    this.addMarkers();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['filteredActivities$'] && this.filteredActivities$ && this._map) {
      this._activitySub?.unsubscribe();
      this.addMarkers();
    }
  }

  addMarkers(): void {
    this._activitySub = this.filteredActivities$.subscribe(activities => {
      this._clearMarkers();
      activities.forEach(activity => {
        this.addActivityMarkers(activity);
        this.addAssociationMarkers(activity);
      });
    });
  }

  private _clearMarkers(): void {
    this._activityMarkers.forEach(marker => marker.remove());
    this._associationMarkers.forEach(marker => marker.remove());
    this._activityMarkers = [];
    this._associationMarkers = [];
  }

  addActivityMarkers(activity: Activity): void {
    if (activity.location?.longitude && activity.location?.latitude && this.mapDisplay.activities) {
      const activityMarker = new maplibregl.Marker({ color: 'red' })
        .setLngLat([activity.location.longitude, activity.location.latitude])
        .setPopup(new maplibregl.Popup().setText(activity.title))
        .addTo(this._map);
      this._activityMarkers.push(activityMarker);
    }
  }

  addAssociationMarkers(activity: Activity): void {
    if (activity.association?.localisation?.longitude && activity.association?.localisation?.latitude && this.mapDisplay.associations) {
      const assocMarker = new maplibregl.Marker({ color: 'green' })
        .setLngLat([activity.association.localisation.longitude, activity.association.localisation.latitude])
        .setPopup(new maplibregl.Popup().setText(activity.association.name))
        .addTo(this._map);
      this._associationMarkers.push(assocMarker);
    }
  }

  ngOnDestroy(): void {
    this._activitySub?.unsubscribe();
  }
}
