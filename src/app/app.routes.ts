import { Routes } from '@angular/router';
import { HomeComponent } from './features/movies/pages/home/home.component';
import { MovieDeatilComponent } from './shared/components/movie-deatil/movie-deatil.component';
import { ActorDetailComponent } from './shared/components/actor-detail/actor-detail.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'movies',
    component: HomeComponent,
  },
  { path: 'pelicula/:id', component: MovieDeatilComponent },
  { path: 'actor/:id', component: ActorDetailComponent },
  {
    path: '**',
    redirectTo: '',
  },
];
