import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

import { HomeComponent } from './core/home/home.component';
import { HomeWithSelectorComponent } from './core/home/home-with-selector.component';
import { OneDirectionComponent } from './one-direction/one-direction.component';
import { TransportDetailComponent } from './transport-detail/transport-detail.component';
import { ContactComponent } from './contact/contact.component';

import { BankHolidayListResolver } from './shared/services/bank-holidays-resolver.service';
import { LineResolver } from './shared/services/line-resolver.service';
// import {DataService} from './shared/data.service';


const appRoutes: Routes = [
  { path: '', component: HomeWithSelectorComponent, resolve: {bankHolidayListResponse: BankHolidayListResolver}},
  // { path: '', component: HomeComponent, resolve: {bankHolidayListResponse: BankHolidayListResolver}},
  { path: 'contact', component: ContactComponent},
  { path: 'one-direction/:direction/:date', component: OneDirectionComponent, resolve: {bankHolidayListResponse: BankHolidayListResolver}},
  { path: 'line-detail/:transporttype/:lineid/:direction/:stationid', component: TransportDetailComponent,resolve: {lineReponse: LineResolver}},
  // { path: 'one-direction', loadChildren: './one-direction/one-direction.module#OneDirectionModule'},
  // { path: 'transport-detail', loadChildren: './transport-detail/transport-detail.module#TransportDetailModule'}
];

@NgModule({
  imports: [
    // RouterModule.forRoot(appRoutes)
    RouterModule.forRoot(appRoutes, {preloadingStrategy: PreloadAllModules})
  ],
  exports: [RouterModule],
  providers: [BankHolidayListResolver, LineResolver]

})
export class AppRoutingModule {
}
