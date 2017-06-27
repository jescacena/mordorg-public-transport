import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { OneDirectionComponent } from './one-direction/one-direction.component';
import { TransportDetailComponent } from './transport-detail/transport-detail.component';
import { DepartureListBoxComponent } from './departure-list-box/departure-list-box.component';

import { DateUtilsService } from './shared/date-utils.service';
import { DataService } from './shared/data.service';
import { DeparturesService } from './shared/departures.service';

import { FormatWhenPipe } from './shared/format-when.pipe';
import { HomeWithSelectorComponent } from './home/home-with-selector.component';
import { DirectionSelectorComponent } from './home/direction-selector/direction-selector.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    OneDirectionComponent,
    TransportDetailComponent,
    DepartureListBoxComponent,
    HomeWithSelectorComponent,
    DirectionSelectorComponent,
    FormatWhenPipe
  ],
  imports: [
    BrowserModule,
    HttpModule,
    AppRoutingModule
  ],
  providers: [DateUtilsService,DataService, DeparturesService],
  bootstrap: [AppComponent]
})
export class AppModule { }
