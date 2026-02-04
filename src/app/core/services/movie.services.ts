import { Injectable, inject, signal, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../../enviroments/environment';

@Injectable({ providedIn: 'root' })
export class MovieService {
  private http = inject(HttpClient);
  private translate = inject(TranslateService);
  private apiKey = environment.API_KEY;
  private baseUrl = 'https://api.themoviedb.org/3';

  // Inicializar el idioma desde localStorage o usar 'es-ES' por defecto
  language = signal<'es-ES' | 'en-US'>(
    (localStorage.getItem('movieAppLanguage') as 'es-ES' | 'en-US') || 'es-ES',
  );

  constructor() {
    // Configurar el idioma inicial de ngx-translate
    const initialLang = this.language() === 'es-ES' ? 'es' : 'en';
    this.translate.setDefaultLang(initialLang);
    this.translate.use(initialLang);

    // Efecto para sincronizar cambios de idioma con localStorage y ngx-translate
    effect(() => {
      const currentLang = this.language();
      localStorage.setItem('movieAppLanguage', currentLang);
      const translateLang = currentLang === 'es-ES' ? 'es' : 'en';
      this.translate.use(translateLang);
    });
  }

  changeLanguage(lang: 'es-ES' | 'en-US') {
    this.language.set(lang);
    // Ya no necesitamos recargar la página, el effect se encarga de todo
  }

  getPopularMovies(): Observable<any[]> {
    return this.http
      .get<any>(
        `${this.baseUrl}/movie/popular?api_key=${this.apiKey}&language=${this.language()}`,
      )
      .pipe(map((res) => res.results));
  }

  getMovieDetails(id: string): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/movie/${id}?api_key=${this.apiKey}&language=${this.language()}&append_to_response=credits,watch/providers`,
    );
  }

  getActorDetails(id: string): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/person/${id}?api_key=${this.apiKey}&language=${this.language()}&append_to_response=combined_credits`,
    );
  }

  searchMovies(query: string): Observable<any[]> {
    return this.http
      .get<any>(
        `${this.baseUrl}/search/movie?api_key=${this.apiKey}&query=${query}&language=${this.language()}`,
      )
      .pipe(map((res) => res.results));
  }
}
