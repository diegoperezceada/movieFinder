import { CommonModule } from '@angular/common';
import { Component, HostListener, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import {
  Subject,
  debounceTime,
  distinctUntilChanged,
  switchMap,
  tap,
} from 'rxjs';
import { MovieService } from '../../../core/services/movie.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  movieService = inject(MovieService);
  private router = inject(Router);

  isScrolled = signal(false);
  showSearch = signal(false);
  searchResults = signal<any[]>([]);
  hasSearched = signal(false);

  private searchSubject = new Subject<string>();

  toggleLanguage() {
    const newLang =
      this.movieService.language() === 'es-ES' ? 'en-US' : 'es-ES';
    this.movieService.changeLanguage(newLang);
  }

  constructor() {
    this.searchSubject
      .pipe(
        tap(() => this.hasSearched.set(false)),
        debounceTime(400),
        distinctUntilChanged(),
        tap(() => this.hasSearched.set(false)),
        switchMap((query) => {
          if (query.trim().length < 3) {
            this.searchResults.set([]);
            return [[]];
          }
          return this.movieService.searchMovies(query);
        }),
      )
      .subscribe((results) => {
        this.searchResults.set(results.slice(0, 6));
        this.hasSearched.set(true);
      });
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled.set(window.scrollY > 50);
  }

  onTyping(event: Event) {
    const query = (event.target as HTMLInputElement).value;
    this.searchSubject.next(query);
  }

  onSearchEnter(event: any) {
    if (this.searchResults().length > 0) {
      const firstMovieId = this.searchResults()[0].id;
      this.router.navigate(['/pelicula', firstMovieId]);
      this.toggleSearch();
    }
  }

  toggleSearch() {
    this.showSearch.update((v) => !v);
    if (!this.showSearch()) {
      this.searchResults.set([]);
      this.hasSearched.set(false);
    }
  }
}
