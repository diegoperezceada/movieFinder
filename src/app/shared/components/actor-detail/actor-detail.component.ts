import { Component, inject, signal, effect } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MovieService } from '../../../core/services/movie.service';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-actor-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './actor-detail.component.html',
  styleUrl: './actor-detail.component.css',
})
export class ActorDetailComponent {
  private route = inject(ActivatedRoute);
  private movieService = inject(MovieService);

  actor = signal<any>(null);
  private currentActorId = signal<string | null>(null);

  constructor() {
    // Efecto que recarga los detalles cuando cambia el idioma
    effect(() => {
      const currentLang = this.movieService.language();
      const actorId = this.currentActorId();

      if (actorId) {
        this.loadActorDetails(actorId);
      }
    });
  }

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.currentActorId.set(id);
      }
    });
  }

  private loadActorDetails(id: string): void {
    this.movieService.getActorDetails(id).subscribe((data) => {
      this.actor.set(data);
    });
  }
}
