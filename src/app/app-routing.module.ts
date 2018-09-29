import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { Angulartics2Module, Angulartics2GoogleAnalytics } from 'angulartics2';

import { HomeComponent } from './core/home/home.component';
import { HomeWithSelectorComponent } from './core/home/home-with-selector.component';
import { OneDirectionComponent } from './one-direction/one-direction.component';
import { TransportDetailComponent } from './transport-detail/transport-detail.component';
import { ContactComponent } from './contact/contact.component';

import { BankHolidayListResolver } from './shared/services/bank-holidays-resolver.service';
import { LineResolver } from './shared/services/line-resolver.service';

const appRoutes: Routes = [
  { path: '', component: HomeWithSelectorComponent, resolve: {bankHolidayListResponse: BankHolidayListResolver}},
  { path: 'home-direction/:direction', component: HomeWithSelectorComponent, resolve: {bankHolidayListResponse: BankHolidayListResolver}},
  // { path: '', component: HomeComponent, resolve: {bankHolidayListResponse: BankHolidayListResolver}},
  { path: 'contact', component: ContactComponent},
  { path: 'one-direction/:direction/:date', component: OneDirectionComponent, resolve: {bankHolidayListResponse: BankHolidayListResolver}},
  { path: 'line-detail/:transporttype/:lineid/:direction/:stationid', component: TransportDetailComponent,resolve: {lineReponse: LineResolver}},
  // { path: 'one-direction', loadChildren: './one-direction/one-direction.module#OneDirectionModule'},
  // { path: 'transport-detail', loadChildren: './transport-detail/transport-detail.module#TransportDetailModule'}
  { path: 'cercedilla-madrid', redirectTo: '/home-direction/0'},
  { path: 'madrid-cercedilla', redirectTo: '/home-direction/1'},
  { path: 'cercedilla-segovia', redirectTo: '/home-direction/2'},
  { path: 'segovia-cercedilla', redirectTo: '/home-direction/3'},
  { path: 'instituto-hospital-fuenfria', redirectTo: '/home-direction/4'},
  { path: 'hospital-fuenfria-instituto', redirectTo: '/home-direction/5'},
  { path: 'cercedilla-hospital-villalba', redirectTo: '/home-direction/6'},
  { path: 'hospital-villalba-cercedilla', redirectTo: '/home-direction/7'},
  { path: 'cercedilla-cotos', redirectTo: '/home-direction/8'},
  { path: 'cotos-cercedilla', redirectTo: '/home-direction/9'},
  { path: 'cercedilla-piscinas-berceas', redirectTo: '/home-direction/10'},
  { path: 'piscinas-berceas-cercedilla', redirectTo: '/home-direction/11'},
];
/*
CercedillaSegovia,
SegoviaCercedilla,
InstitutoHospitalFuenfria,
HospitalFuenfriaInstituto,
CercedillaHospitalVillalba,
HospitalVillalbaCercedila,
CercedillaCotos,
CotosCercedilla,
CercedillaPiscinasBerceas,
PiscinasBerceasCercedilla*/

@NgModule({
  imports: [
    // RouterModule.forRoot(appRoutes)
    RouterModule.forRoot(appRoutes, {preloadingStrategy: PreloadAllModules}),
    Angulartics2Module.forRoot([ Angulartics2GoogleAnalytics ])

  ],
  exports: [RouterModule],
  providers: [BankHolidayListResolver, LineResolver]

})
export class AppRoutingModule {
}
