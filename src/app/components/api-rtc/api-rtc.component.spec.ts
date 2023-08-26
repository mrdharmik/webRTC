import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiRTCComponent } from './api-rtc.component';

describe('ApiRTCComponent', () => {
  let component: ApiRTCComponent;
  let fixture: ComponentFixture<ApiRTCComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ ApiRTCComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApiRTCComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
