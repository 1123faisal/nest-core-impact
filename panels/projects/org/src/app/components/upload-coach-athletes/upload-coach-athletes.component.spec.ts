import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadCoachAthletesComponent } from './upload-coach-athletes.component';

describe('UploadCoachAthletesComponent', () => {
  let component: UploadCoachAthletesComponent;
  let fixture: ComponentFixture<UploadCoachAthletesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadCoachAthletesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadCoachAthletesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
