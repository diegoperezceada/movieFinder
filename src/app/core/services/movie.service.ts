import { Injectable, inject, signal, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Injectable({ providedIn: 'root' })
export class MovieService {
  private http = inject(HttpClient);
  private translate = inject(TranslateService);
  private apiBaseUrl = '/api';

  language = signal<'es-ES' | 'en-US'>(
    (localStorage.getItem('movieAppLanguage') as 'es-ES' | 'en-US') || 'es-ES',
  );

  constructor() {
    const initialLang = this.language() === 'es-ES' ? 'es' : 'en';
    this.translate.setDefaultLang(initialLang);
    this.translate.use(initialLang);

    effect(() => {
      const currentLang = this.language();
      localStorage.setItem('movieAppLanguage', currentLang);
      const translateLang = currentLang === 'es-ES' ? 'es' : 'en';
      this.translate.use(translateLang);
    });
  }

  changeLanguage(lang: 'es-ES' | 'en-US') {
    this.language.set(lang);
  }

  getPopularMovies(): Observable<any[]> {
    return this.http
      .get<any>(`${this.apiBaseUrl}/movies/popular?language=${this.language()}`)
      .pipe(map((res) => res.results));
  }

  getMovieDetails(id: string): Observable<any> {
    return this.http.get<any>(
      `${this.apiBaseUrl}/movies/details?id=${id}&language=${this.language()}`,
    );
  }

  getActorDetails(id: string): Observable<any> {
    return this.http.get<any>(
      `${this.apiBaseUrl}/actors/details?id=${id}&language=${this.language()}`,
    );
  }

  searchMovies(query: string): Observable<any[]> {
    return this.http
      .get<any>(
        `${this.apiBaseUrl}/movies/search?query=${encodeURIComponent(query)}&language=${this.language()}`,
      )
      .pipe(map((res) => res.results));
  }
}
