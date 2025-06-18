import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrendingPageComponent } from './trending-page.component';

describe('TrendingPageComponent', () => {
  let component: TrendingPageComponent;
  let fixture: ComponentFixture<TrendingPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrendingPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrendingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
