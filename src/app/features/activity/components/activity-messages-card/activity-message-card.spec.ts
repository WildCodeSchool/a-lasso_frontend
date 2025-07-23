import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivityMessagesCardComponent } from './activity-messages-card.component';
import { ActivityFacadeService } from '../../services/activity-facade.service';
import { provideMockStore } from '@ngrx/store/testing';


describe('Activity Messages Card Component', () => {

    let component: ActivityMessagesCardComponent;
    let fixture: ComponentFixture<ActivityMessagesCardComponent>;

    const mock = { postActivityMessage: jest.fn() };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ActivityMessagesCardComponent],
            providers: [
                { provide: ActivityFacadeService, useValue: mock },
                provideMockStore({})
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(ActivityMessagesCardComponent);
        component = fixture.componentInstance;
    });

    it('should post message sucessfully', () => {

        // Arrange
        const messageForm = { message: 'Hello World' };
        const activityId = '12345';

        // Act
        component.messageForm.setValue(messageForm);
        component.activityId = activityId;
        component.postMessage();

        // Assert
        expect(mock.postActivityMessage).toHaveBeenCalledWith({
            activityId: activityId,
            content: messageForm.message,
            date: expect.any(Date)
        });

        expect(component.messageForm.value.message).toBe(null);

    });


    it('should fail when post an empty message', () => {

        // Arrange
        const messageForm = { message: '' };
        const activityId = '12345';

        // Act
        component.messageForm.setValue(messageForm);
        component.activityId = activityId;
        component.postMessage();

        // Assert
        expect(mock.postActivityMessage).not.toHaveBeenCalled();
    });

});