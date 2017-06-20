import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OneDirectionComponent } from './one-direction.component';

describe('OneDirectionComponent', () => {
  let component: OneDirectionComponent;
  let fixture: ComponentFixture<OneDirectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OneDirectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OneDirectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
