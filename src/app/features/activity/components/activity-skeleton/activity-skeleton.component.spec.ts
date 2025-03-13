import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivitySkeletonComponent } from './activity-skeleton.component';

describe('ActivitySkeletonComponent', () => {
  let component: ActivitySkeletonComponent;
  let fixture: ComponentFixture<ActivitySkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivitySkeletonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActivitySkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
