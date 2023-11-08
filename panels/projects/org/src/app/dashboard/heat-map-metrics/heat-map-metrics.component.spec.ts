import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeatMapMetricsComponent } from './heat-map-metrics.component';

describe('HeatMapMetricsComponent', () => {
  let component: HeatMapMetricsComponent;
  let fixture: ComponentFixture<HeatMapMetricsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeatMapMetricsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeatMapMetricsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
