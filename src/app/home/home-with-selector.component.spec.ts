import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeWithSelectorComponent } from './home-with-selector.component';

describe('HomeWithSelectorComponent', () => {
  let component: HomeWithSelectorComponent;
  let fixture: ComponentFixture<HomeWithSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeWithSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeWithSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
