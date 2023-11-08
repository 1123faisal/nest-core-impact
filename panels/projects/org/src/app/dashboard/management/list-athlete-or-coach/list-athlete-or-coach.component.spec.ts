import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAthleteOrCoachComponent } from './list-athlete-or-coach.component';

describe('ListAthleteOrCoachComponent', () => {
  let component: ListAthleteOrCoachComponent;
  let fixture: ComponentFixture<ListAthleteOrCoachComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListAthleteOrCoachComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListAthleteOrCoachComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
