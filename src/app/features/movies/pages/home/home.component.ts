import { Component, inject, signal, effect } from '@angular/core';
import { MovieService } from '../../../../core/services/movie.service';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, TranslateModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  private movieService = inject(MovieService);

  movies = signal<any[]>([]);

  constructor() {
    effect(() => {
      const currentLang = this.movieService.language();

      this.loadMovies();
    });
  }

  private loadMovies(): void {
    this.movieService.getPopularMovies().subscribe({
      next: (data) => {
        this.movies.set(data);
      },
      error: (err) => console.error('Error cargando películas:', err),
    });
  }
}
