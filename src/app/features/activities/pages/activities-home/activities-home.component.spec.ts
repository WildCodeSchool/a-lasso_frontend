import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivitiesHomeComponent } from './activities-home.component';

describe('ActivitiesHomeComponent', () => {
  let component: ActivitiesHomeComponent;
  let fixture: ComponentFixture<ActivitiesHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivitiesHomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActivitiesHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
