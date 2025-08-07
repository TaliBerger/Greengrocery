import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VegetablesGrid } from './vegetables-grid';

describe('VegetablesGrid', () => {
  let component: VegetablesGrid;
  let fixture: ComponentFixture<VegetablesGrid>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VegetablesGrid]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VegetablesGrid);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
