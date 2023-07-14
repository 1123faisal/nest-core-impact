import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAthletesOrCoachComponent } from './add-athlete-or-coach.component';

describe('AddAthletOrCoachComponent', () => {
  let component: AddAthletesOrCoachComponent;
  let fixture: ComponentFixture<AddAthletesOrCoachComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddAthletesOrCoachComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddAthletesOrCoachComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
