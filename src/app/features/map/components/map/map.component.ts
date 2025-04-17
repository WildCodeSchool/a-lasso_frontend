import { Component, Input, inject, OnChanges, SimpleChanges, ViewChild, AfterViewInit } from '@angular/core';
import maplibregl, { Marker, Popup } from 'maplibre-gl';
import { Activity } from 'src/app/features/activity/models/activity.model';
import { Observable, of, Subscription, switchMap } from 'rxjs';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { MapDisplayType } from '../../models/map';

import { FRANCE_LATITUDE, FRANCE_LONGITUDE } from '../../constants/map.constants';
import { PopupMapComponent } from '../popup-map/popup-map.component';
import { environmentSecret } from 'src/environments/environment.secret';
import { ActivityFacadeService } from '../../../activity/services/activity-facade.service';
import { DestroyableComponent } from '../../../../common/utils/DestroyableComponent';
import { AuthService } from 'src/app/features/authentication/services/auth.service';
import { VoluntaryProfileService } from 'src/app/features/profile/services/voluntary-profil.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  imports: [FormsModule, CheckboxModule, PopupMapComponent],
  styleUrl: './map.component.scss',
})
export class MapComponent extends DestroyableComponent implements AfterViewInit, OnChanges {
  private _activityFacadeService: ActivityFacadeService = inject(ActivityFacadeService);
  private _voluntaryProfileService: VoluntaryProfileService = inject(VoluntaryProfileService);
  private _authService: AuthService = inject(AuthService);

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
    this._initializeMapBasedOnUserProfile();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this._updateMarkersOnFiltersChange(changes);
  }

  addMarkers(): void {
    this._activitySub = this.filteredActivities$.pipe(this.untilDestroyed()).subscribe(activities => {
      this._clearMarkers();
      activities.forEach(activity => {
        this.addActivityMarkers(activity);
        this.addAssociationMarkers(activity);
      });
    });
  }

  addActivityMarkers(activity: Activity): void {
    const { longitude, latitude } = activity.location ?? {};
    if (longitude && latitude && this.mapDisplay.activities) {
      const marker = this._createMarker(longitude, latitude, 'red', () => {
        this.popupComponent.activity = activity;
        this.popupComponent.isSavedActivity$ = this._activityFacadeService.getIsSavedActivity(activity.id);
        this.popupComponent.association = null;
        this._openPopup(longitude, latitude);
      });

      this._activityMarkers.push(marker);
    }
  }

  addAssociationMarkers(activity: Activity): void {
    const localisation = activity.association?.localisation;
    if (localisation?.longitude && localisation?.latitude && this.mapDisplay.associations) {
      const marker = this._createMarker(localisation.longitude, localisation.latitude, 'green', () => {
        this.popupComponent.association = activity.association;
        this.popupComponent.setCountActivityOfAssociation(activity.association);
        this.popupComponent.activity = null;
        this._openPopup(localisation.longitude, localisation.latitude);
      });

      this._associationMarkers.push(marker);
    }
  }

  flyTo(lon: number, lat: number, zoom: number = 10): void {
    if (this._map) {
      this._map.flyTo({
        center: [lon, lat],
        zoom: zoom,
        essential: true,
      });
    }
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

  private _createMarker(lng: number, lat: number, color: string, onClick: () => void): maplibregl.Marker {
    const marker: Marker = new maplibregl.Marker({ color });

    marker.setLngLat([lng, lat]).addTo(this._map);
    marker.getElement().addEventListener('click', onClick);

    return marker;
  }

  private _openPopup(lng: number, lat: number): void {
    this.popup.setDOMContent(this.popupComponent.element);
    this.popup.setLngLat([lng, lat]);
    this.popup.addTo(this._map);
  }

  private _initializeMapBasedOnUserProfile(): void {
    this._authService
      .isVoluntaryUser()
      .pipe(
        switchMap(isVoluntary => (isVoluntary ? this._voluntaryProfileService.getVoluntary() : of(null))),
        this.untilDestroyed()
      )
      .subscribe(voluntary => {
        let center: [number, number] = [FRANCE_LONGITUDE, FRANCE_LATITUDE];
        let zoom = 5;

        const geolocation = voluntary?.geolocation;
        if (geolocation?.longitude && geolocation?.latitude) {
          center = [geolocation.longitude, geolocation.latitude];
          zoom = 10;
        }

        this._initializeMap(center, zoom);
      });
  }

  private _initializeMap(center: [number, number], zoom: number): void {
    this._map = new maplibregl.Map({
      container: 'map',
      style: `https://api.maptiler.com/maps/streets/style.json?key=${this._mapKey}`,
      center,
      zoom,
    });

    this._map.addControl(new maplibregl.NavigationControl());
    this.addMarkers();

    this._handleMapClick();
  }

  private _handleMapClick(): void {
    this._map.on('click', e => {
      const features = this._map.queryRenderedFeatures(e.point);
      const isMarkerClick = features.length > 0;

      if (!isMarkerClick) {
        this.popup.remove();
      }
    });
  }
}
