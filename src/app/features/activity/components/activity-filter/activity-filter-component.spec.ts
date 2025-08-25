import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ThemeName, Theme } from '../../models/activity.model';
import { ActivityFilterComponent } from './activity-filter.component';
import { ButtonClicked } from '../../../../common/models/button';
import {ActivityFacadeService} from '../../services/activity-facade.service';


describe('Activity filter component', () => {

    let component: ActivityFilterComponent;
    let fixture: ComponentFixture<ActivityFilterComponent>;

      const mockGetActivityThemesFromApi = { getActivityThemesFromApi: jest.fn() };


    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ActivityFilterComponent],
            providers: [
                { provide: ActivityFacadeService, useValue: mockGetActivityThemesFromApi }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(ActivityFilterComponent);
        component = fixture.componentInstance;
        
    });

    describe('updateSelectedThemes', () => {

    it('should add selected theme to the list', () => {

        // Arrange
        const selected : ThemeName[]= [ThemeName.Social,ThemeName.Culinaire]
        const themeClicked : ButtonClicked = {
            id : 1, 
            event : new MouseEvent('click'),
            label: ThemeName.Nature,   
        }


        // Act
        component.selected = selected
        jest.spyOn(component.selectedThemes, 'emit');
        component.updateSelectedThemes(themeClicked);
        

        // Assert
        expect(component.selected).toContain(ThemeName.Nature);
        expect(component.selectedThemes.emit).toHaveBeenCalledWith([...component.selected]);
        if( component.formGroup && component.formThemeField) {
            expect(component.formGroup.get(component.formThemeField)?.value).toEqual(component.selected);
            expect(component.formGroup.get(component.formThemeField)?.touched).toBeTruthy();
        }
            
    });

     it('should remove selected theme to the list', () => {

        // Arrange
        const selected : ThemeName[]= [ThemeName.Social,ThemeName.Culinaire]
        const themeClicked : ButtonClicked = {
            id : 1, 
            event : new MouseEvent('click'),
            label: ThemeName.Culinaire,   
        }


        // Act
        component.selected = selected
        jest.spyOn(component.selectedThemes, 'emit');
        component.updateSelectedThemes(themeClicked);
        

        // Assert
        expect(component.selected).toEqual([ThemeName.Social]);
        expect(component.selectedThemes.emit).toHaveBeenCalledWith([...component.selected]);
        if( component.formGroup && component.formThemeField) {
            expect(component.formGroup.get(component.formThemeField)?.value).toEqual(component.selected);
            expect(component.formGroup.get(component.formThemeField)?.touched).toBeTruthy();
        }
            
    });
})




});