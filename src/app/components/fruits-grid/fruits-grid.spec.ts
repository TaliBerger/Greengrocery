import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FruitsGrid } from './fruits-grid';

describe('FruitsGrid', () => {
  let component: FruitsGrid;
  let fixture: ComponentFixture<FruitsGrid>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FruitsGrid]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FruitsGrid);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
