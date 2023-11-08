import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResendOtpComponent } from './resend-otp.component';

describe('ResendOtpComponent', () => {
  let component: ResendOtpComponent;
  let fixture: ComponentFixture<ResendOtpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResendOtpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResendOtpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
