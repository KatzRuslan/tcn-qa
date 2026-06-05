import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplatesRight } from './templates-right';

describe('TemplatesRight', () => {
  let component: TemplatesRight;
  let fixture: ComponentFixture<TemplatesRight>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TemplatesRight]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TemplatesRight);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
