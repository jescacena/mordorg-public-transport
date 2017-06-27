import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartureListBoxComponent } from './departure-list-box.component';

describe('DepartureListBoxComponent', () => {
  let component: DepartureListBoxComponent;
  let fixture: ComponentFixture<DepartureListBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DepartureListBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DepartureListBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
