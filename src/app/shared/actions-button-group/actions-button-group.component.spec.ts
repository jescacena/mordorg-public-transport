import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionsButtonGroupComponent } from './actions-button-group.component';

describe('ActionsButtonGroupComponent', () => {
  let component: ActionsButtonGroupComponent;
  let fixture: ComponentFixture<ActionsButtonGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActionsButtonGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionsButtonGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
