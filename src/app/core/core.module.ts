import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeComponent } from './home/home.component';
import { HomeWithSelectorComponent } from './home/home-with-selector.component';
import { DirectionSelectorComponent } from './home/direction-selector/direction-selector.component';
import { MyDatePickerModule } from 'mydatepicker';
import { FormsModule } from '@angular/forms';
import { BsDropdownModule } from 'ngx-bootstrap';





import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';

import { SharedModule } from '../shared/shared.module';

import { AppRoutingModule } from '../app-routing.module';

import { DateUtilsService } from '../shared/services/date-utils.service';
import { DataService } from '../shared/services/data.service';



@NgModule({
  declarations: [
    HomeComponent,
    HomeWithSelectorComponent,
    HeaderComponent,
    DirectionSelectorComponent,
    FooterComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    AppRoutingModule,
    MyDatePickerModule,
    FormsModule,
    BsDropdownModule.forRoot()
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    AppRoutingModule
  ],
  // providers: [DateUtilsService, DataService],

})

export class CoreModule {}
