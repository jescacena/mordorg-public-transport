import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectionSelectorComponent } from './direction-selector.component';

describe('DirectionSelectorComponent', () => {
  let component: DirectionSelectorComponent;
  let fixture: ComponentFixture<DirectionSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DirectionSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DirectionSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
