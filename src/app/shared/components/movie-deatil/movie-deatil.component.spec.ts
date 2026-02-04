import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovieDeatilComponent } from './movie-deatil.component';

describe('MovieDeatilComponent', () => {
  let component: MovieDeatilComponent;
  let fixture: ComponentFixture<MovieDeatilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovieDeatilComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MovieDeatilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
