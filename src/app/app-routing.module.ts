import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { OneDirectionComponent } from './one-direction/one-direction.component';

import { BankHolidayListResolver } from './shared/bank-holidays-resolver.service';
// import {DataService} from './shared/data.service';


const appRoutes: Routes = [
  { path: '', component: HomeComponent, resolve: {bankHolidayListResponse: BankHolidayListResolver}},
  { path: 'one-direction', component: OneDirectionComponent},
  // { path: 'one-direction', loadChildren: './one-direction/one-direction.module#OneDirectionModule'},
  // { path: 'transport-detail', loadChildren: './transport-detail/transport-detail.module#TransportDetailModule'}
];

@NgModule({
  imports: [
    // RouterModule.forRoot(appRoutes)
    RouterModule.forRoot(appRoutes, {preloadingStrategy: PreloadAllModules})
  ],
  exports: [RouterModule],
  providers: [BankHolidayListResolver]

})
export class AppRoutingModule {
}