import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

import { HomeComponent } from './home/home.component';

const appRoutes: Routes = [
  { path: '', component: HomeComponent},
  // { path: 'one-direction', loadChildren: './one-direction/one-direction.module#OneDirectionModule'},
  // { path: 'transport-detail', loadChildren: './transport-detail/transport-detail.module#TransportDetailModule'}
];

@NgModule({
  imports: [
    // RouterModule.forRoot(appRoutes)
    RouterModule.forRoot(appRoutes, {preloadingStrategy: PreloadAllModules})
  ],
  exports: [RouterModule]

})
export class AppRoutingModule {
}
