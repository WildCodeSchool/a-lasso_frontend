// import { TestBed } from '@angular/core/testing';
// import { ActivityFacadeService } from './activity-facade.service';
// import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
// import { ActivitiesApiService } from './activities-api.service';
// import { environment } from '../../../../environments/environment.development';
// import { Activity, AssociationActivity, Localisation, Participant } from '../models/activity.model';
// import { Store } from '@ngrx/store';
// import * as ActivityActions from '../store/activities.actions';

// describe('ActivityFacadeService', () => {
//   let service: ActivityFacadeService;
//   let httpMock: HttpTestingController;
//   let storeDispatchSpy: jest.SpyInstance;

//   const _apiUrl = environment.apiUrl;
//   const activityId = '1';

//   beforeEach(() => {
//     storeDispatchSpy = jest.spyOn(Store.prototype, 'dispatch');

//     TestBed.configureTestingModule({
//       imports: [HttpClientTestingModule],
//       providers: [ActivityFacadeService, ActivitiesApiService, Store],
//     });

//     service = TestBed.inject(ActivityFacadeService);
//     httpMock = TestBed.inject(HttpTestingController);
//   });

//   it('should fetch and add activity to the store', () => {
//     const mockActivity: Activity = {
//       id: '1',
//       title: 'Sample Activity',
//       description: 'A sample activity description',
//       images: [],
//       association: {} as AssociationActivity,
//       location: {} as Localisation,
//       date: new Date(),
//       participants: {} as Participant,
//       themesName: [],
//     };

//     service.getActivityByIdFromApiAndDispatchStore(activityId).subscribe();

//     const reqToApi = httpMock.expectOne(`${_apiUrl}/activities/${activityId}`);
//     expect(reqToApi.request.method).toBe('GET');

//     reqToApi.flush(mockActivity);

//     expect(storeDispatchSpy).toHaveBeenCalledWith(
//       ActivityActions.setActivity({ activity: mockActivity })
//     );
//   });
// });
