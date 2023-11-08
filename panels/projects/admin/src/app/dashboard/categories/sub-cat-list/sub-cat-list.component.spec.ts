import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubCatListComponent } from './sub-cat-list.component';

describe('SubCatListComponent', () => {
  let component: SubCatListComponent;
  let fixture: ComponentFixture<SubCatListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubCatListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubCatListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
