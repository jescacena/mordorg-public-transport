import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LineRouteComponent } from './line-route.component';

describe('LineRouteComponent', () => {
  let component: LineRouteComponent;
  let fixture: ComponentFixture<LineRouteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LineRouteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LineRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
