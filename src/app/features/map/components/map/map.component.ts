import { Component, Input, inject, OnChanges, SimpleChanges, DestroyRef, ViewChild, AfterViewInit } from '@angular/core';
import maplibregl, { Popup } from 'maplibre-gl';
import { Activity } from 'src/app/features/activity/models/activity.model';
import { Observable, Subscription } from 'rxjs';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { MapDisplayType } from '../../models/map';

import { FRANCE_LATITUDE, FRANCE_LONGITUDE } from '../../constants/map.constants';
import { PopupMapComponent } from '../popup-map/popup-map.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { environmentSecret } from 'src/environments/environment.secret';
import { ActivityFacadeService } from '../../../activity/services/activity-facade.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  imports: [FormsModule, CheckboxModule, PopupMapComponent],
  styleUrl: './map.component.scss',
})
export class MapComponent implements AfterViewInit, OnChanges {
  private _destroyRef = inject(DestroyRef);
  private _activityFacadeService: ActivityFacadeService = inject(ActivityFacadeService);

  @Input() filteredActivities$!: Observable<Activity[]>;
  @ViewChild('popupRef') popupComponent!: PopupMapComponent;

  private _mapKey = environmentSecret.apiMapKey;
  private _map!: maplibregl.Map;
  private _activityMarkers: maplibregl.Marker[] = [];
  private _associationMarkers: maplibregl.Marker[] = [];
  private _activitySub: Subscription | null = null;

  popup: Popup = new maplibregl.Popup({
    closeButton: true,
    closeOnClick: false,
    closeOnMove: false,
    maxWidth: '500px',
  });
  mapDisplay: MapDisplayType = { activities: true, associations: true };

  ngAfterViewInit(): void {
    this._map = new maplibregl.Map({
      container: 'map',
      style: `https://api.maptiler.com/maps/streets/style.json?key=${this._mapKey}`,
      center: [FRANCE_LONGITUDE, FRANCE_LATITUDE],
      zoom: 5,
    });

    this._map.addControl(new maplibregl.NavigationControl());
    this.addMarkers();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this._updateMarkersOnFiltersChange(changes);
  }

  addMarkers(): void {
    this._activitySub = this.filteredActivities$.pipe(takeUntilDestroyed(this._destroyRef)).subscribe(activities => {
      this._clearMarkers();
      activities.forEach(activity => {
        this.addActivityMarkers(activity);
        this.addAssociationMarkers(activity);
      });
    });
  }

  private _updateMarkersOnFiltersChange(changes: SimpleChanges): void {
    if (changes['filteredActivities$'] && this.filteredActivities$ && this._map) {
      this.addMarkers();
    }
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
        .addTo(this._map);

      activityMarker.getElement().addEventListener('click', () => {
        this.popupComponent.activity = activity;
        this.popupComponent.isSavedActivity$ = this._activityFacadeService.getIsSavedActivity(activity.id);
        this.popupComponent.association = null;
        this.popup.setDOMContent(this.popupComponent.element);
        this.popup.setLngLat([activity.location.longitude, activity.location.latitude]);
        this.popup.addTo(this._map);
      });

      this._activityMarkers.push(activityMarker);
    }
  }

  addAssociationMarkers(activity: Activity): void {
    if (activity.association?.localisation?.longitude && activity.association?.localisation?.latitude && this.mapDisplay.associations) {
      const assocMarker = new maplibregl.Marker({ color: 'green' })
        .setLngLat([activity.association.localisation.longitude, activity.association.localisation.latitude])
        .addTo(this._map);

      assocMarker.getElement().addEventListener('click', () => {
        this.popupComponent.association = activity.association;
        this.popupComponent.setCountActivityOfAssociation(activity.association);
        this.popupComponent.activity = null;
        this.popup.setDOMContent(this.popupComponent.element);
        this.popup.setLngLat([activity.association.localisation.longitude, activity.association.localisation.latitude]);
        this.popup.addTo(this._map);
      });
      this._associationMarkers.push(assocMarker);
    }
  }
}
