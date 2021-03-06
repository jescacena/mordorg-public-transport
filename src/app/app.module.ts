import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { MyDatePickerModule } from 'mydatepicker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LeafletModule } from '@asymmetrik/angular2-leaflet';
import { Ng2DeviceDetectorModule } from 'ng2-device-detector';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TransportDetailComponent } from './transport-detail/transport-detail.component';

import { DateUtilsService } from './shared/services/date-utils.service';
import { DataService } from './shared/services/data.service';
import { CacheService } from './shared/services/cache.service';
import { DeparturesService } from './shared/services/departures.service';


import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { OneDirectionModule } from './one-direction/one-direction.module';
import { TransportDetailModule } from './transport-detail/transport-detail.module';
import { ContactComponent } from './contact/contact.component';



@NgModule({
  declarations: [
    AppComponent,
    ContactComponent,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    AppRoutingModule,
    CoreModule,
    OneDirectionModule,
    TransportDetailModule,
    SharedModule,
    MyDatePickerModule,
    BrowserAnimationsModule,
    LeafletModule,
    Ng2DeviceDetectorModule.forRoot()
  ],
  providers: [DateUtilsService,DataService,CacheService, DeparturesService],
  bootstrap: [AppComponent]
})
export class AppModule { }
