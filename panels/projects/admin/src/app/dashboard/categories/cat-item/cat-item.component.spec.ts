import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatItemComponent } from './cat-item.component';

describe('CatItemComponent', () => {
  let component: CatItemComponent;
  let fixture: ComponentFixture<CatItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CatItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CatItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
