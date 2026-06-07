import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestConfigurations } from './test-configurations';

describe('TestConfigurations', () => {
  let component: TestConfigurations;
  let fixture: ComponentFixture<TestConfigurations>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestConfigurations]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestConfigurations);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
