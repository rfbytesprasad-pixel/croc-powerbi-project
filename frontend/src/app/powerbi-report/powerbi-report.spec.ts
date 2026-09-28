import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PowerbiReport } from './powerbi-report';

describe('PowerbiReport', () => {
  let component: PowerbiReport;
  let fixture: ComponentFixture<PowerbiReport>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PowerbiReport],
    }).compileComponents();

    fixture = TestBed.createComponent(PowerbiReport);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
