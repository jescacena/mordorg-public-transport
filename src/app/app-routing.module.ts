import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

import { HomeComponent } from './core/home/home.component';
import { HomeWithSelectorComponent } from './core/home/home-with-selector.component';
import { OneDirectionComponent } from './one-direction/one-direction.component';

import { BankHolidayListResolver } from './shared/services/bank-holidays-resolver.service';
// import {DataService} from './shared/data.service';


const appRoutes: Routes = [
  { path: '', component: HomeWithSelectorComponent, resolve: {bankHolidayListResponse: BankHolidayListResolver}},
  // { path: '', component: HomeComponent, resolve: {bankHolidayListResponse: BankHolidayListResolver}},
  { path: 'one-direction/:direction/:date', component: OneDirectionComponent, resolve: {bankHolidayListResponse: BankHolidayListResolver}},
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
