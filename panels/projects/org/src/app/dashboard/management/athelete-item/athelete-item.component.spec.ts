import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AtheleteItemComponent } from './athelete-item.component';

describe('AtheleteItemComponent', () => {
  let component: AtheleteItemComponent;
  let fixture: ComponentFixture<AtheleteItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AtheleteItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AtheleteItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
