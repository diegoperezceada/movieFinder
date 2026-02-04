import { Component, inject, signal, effect } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MovieService } from '../../../core/services/movie.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-movie-deatil',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './movie-deatil.component.html',
  styleUrl: './movie-deatil.component.css',
})
export class MovieDeatilComponent {
  private route = inject(ActivatedRoute);
  private movieService = inject(MovieService);

  movie = signal<any>(null);
  private currentMovieId = signal<string | null>(null);

  constructor() {
    // Efecto que recarga los detalles cuando cambia el idioma
    effect(() => {
      const currentLang = this.movieService.language();
      const movieId = this.currentMovieId();

      if (movieId) {
        this.loadMovieDetails(movieId);
      }
    });
  }

  ngOnInit() {
    // Suscribirse a los cambios de parámetros de la ruta
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.currentMovieId.set(id);
      }
    });
  }

  private loadMovieDetails(id: string): void {
    this.movieService.getMovieDetails(id).subscribe((data) => {
      this.movie.set(data);
    });
  }
}
