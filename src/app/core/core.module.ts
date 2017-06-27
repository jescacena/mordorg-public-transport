import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeComponent } from './home/home.component';
import { HomeWithSelectorComponent } from './home/home-with-selector.component';
import { DirectionSelectorComponent } from './home/direction-selector/direction-selector.component';
import { MyDatePickerModule } from 'mydatepicker';
import { FormsModule } from '@angular/forms';




import { HeaderComponent } from './header/header.component';

import { SharedModule } from '../shared/shared.module';

import { AppRoutingModule } from '../app-routing.module';

import { DateUtilsService } from '../shared/services/date-utils.service';
import { DataService } from '../shared/services/data.service';



@NgModule({
  declarations: [
    HomeComponent,
    HomeWithSelectorComponent,
    HeaderComponent,
    DirectionSelectorComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    AppRoutingModule,
    MyDatePickerModule,
    FormsModule
  ],
  exports: [
    HeaderComponent,
    AppRoutingModule
  ],
  // providers: [DateUtilsService, DataService],

})

export class CoreModule {}
