import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Registern } from './registern';

describe('Registern', () => {
  let component: Registern;
  let fixture: ComponentFixture<Registern>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Registern]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Registern);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
