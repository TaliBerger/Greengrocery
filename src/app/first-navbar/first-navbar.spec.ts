import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirstNavbar } from './first-navbar';

describe('FirstNavbar', () => {
  let component: FirstNavbar;
  let fixture: ComponentFixture<FirstNavbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FirstNavbar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FirstNavbar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
