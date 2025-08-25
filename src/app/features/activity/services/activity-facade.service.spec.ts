import { TestBed } from '@angular/core/testing';
import { ActivityFacadeService } from './activity-facade.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ActivitiesApiService } from './activities-api.service';
import { environment } from '../../../../environments/environment';
import { Activity, AssociationActivity, Localisation, Participant } from '../models/activity.model';
import { Store } from '@ngrx/store';
import * as ActivityActions from '../store/activities.actions';
import { provideMockStore } from '@ngrx/store/testing';
import { MessageService as Toast } from 'primeng/api';
import { ActivityStatusEnum } from '../models/activity-creation.model';

describe('ActivityFacadeService', () => {
  let service: ActivityFacadeService;
  let httpMock: HttpTestingController;
  let storeDispatchSpy: jest.SpyInstance;

  const _apiUrl = environment.apiUrl;
  const activityId = '1';

  beforeEach(() => {
    storeDispatchSpy = jest.spyOn(Store.prototype, 'dispatch');

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ActivityFacadeService, ActivitiesApiService, Toast,  provideMockStore({})],
    });

    service = TestBed.inject(ActivityFacadeService);
    httpMock = TestBed.inject(HttpTestingController);
  });



  it('should fetch and add activity to the store', () => {

    // ARRANGE
    const mockActivity: Activity = {
      status : ActivityStatusEnum.PUBLISHED,
      id: '1',
      title: 'Sample Activity',
      description: 'A sample activity description',
      images: [],
      association: {} as AssociationActivity,
      address: {
        houseNumber: '123',
        streetName: 'Sample St',
        zipCode: '12345',
        city: 'Sample City',
        country: 'Sample Country',
        displayName: '123 Sample St, Sample City, 12345, Sample Country',
      },
      location: {} as Localisation,
      date: new Date(),
      participants: {} as Participant,
      themesName: [],
    };

    // ACT 

    service.getActivityByIdFromApiAndDispatchStore(activityId).subscribe();

    const reqToApi = httpMock.expectOne(`${_apiUrl}/activities/${activityId}`);

    // ASSERT
    expect(reqToApi.request.method).toBe('GET');

    reqToApi.flush(mockActivity); // execute the request

    expect(storeDispatchSpy).toHaveBeenCalledWith(
      ActivityActions.setActivity({ activity: mockActivity })
    );
  

  });


});
