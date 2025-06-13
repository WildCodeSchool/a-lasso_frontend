// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { ActivityAddPhotoComponent } from './activity-add-photo.component';
// import { ImageCropperComponent } from './image-cropper.component';
// import { Component } from '@angular/core';
// import { MessageService } from 'primeng/api';

// describe('ActivityAddPhotoComponent', () => {
//   let component: ActivityAddPhotoComponent;
//   let fixture: ComponentFixture<ActivityAddPhotoComponent>;

//   // beforeAll(() => {
//   //   (globalThis.URL as any).createObjectURL = jest.fn(() => 'mock-url');
//   // });

//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       // 👇 only import the component under test
//       imports: [ActivityAddPhotoComponent, ImageCropperComponent],
//     //   declarations: [ImageCropperTestComponent],
//       providers: [
//         { provide: MessageService, useValue: { add: jest.fn() } },
//       ]
//     })
//       // .overrideComponent(ActivityAddPhotoComponent, {
//       //   set: {
//       //     // 👇 override its internal standalone imports with mock
//       //     imports: [ImageCropperComponent],
//       //   }
//       // })
//       .compileComponents();

//     fixture = TestBed.createComponent(ActivityAddPhotoComponent);
//     component = fixture.componentInstance;
//   });

//   it('should handle file with correct size', () => {
//     const blobContent = new Array(1000).fill('a').join('');
//     const testFile = new File([blobContent], 'test.jpg', { type: 'image/jpeg' });

//     const event = {
//       target: {
//         files: [testFile]
//       }
//     } as unknown as Event;

//     component.handleFileInput(event, 1);

//     expect(component.imageChangedEvent).toBe(event);
//     expect(component.currentPictureIndex).toBe(1);
//     expect(component.isCropperVisible).toBe(true);
//   });
// });
