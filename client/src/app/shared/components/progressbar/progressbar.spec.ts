import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Progressbar } from './progressbar';

describe('Progressbar', () => {
  let component: Progressbar;
  let fixture: ComponentFixture<Progressbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Progressbar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Progressbar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
