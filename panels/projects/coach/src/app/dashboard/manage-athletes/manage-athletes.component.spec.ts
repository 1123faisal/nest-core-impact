import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageAthletesComponent } from './manage-athletes.component';

describe('ManageAthletesComponent', () => {
  let component: ManageAthletesComponent;
  let fixture: ComponentFixture<ManageAthletesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageAthletesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageAthletesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
