import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyDatePickerModule } from 'mydatepicker';
import { FormsModule } from '@angular/forms';
import { TooltipModule } from 'ngx-bootstrap';


import { DepartureListBoxComponent } from './departure-list-box/departure-list-box.component';
import { LineRouteComponent } from './line-route/line-route.component';
import { StopDetailComponent } from './stop-detail/stop-detail.component';

import { BankHoliday } from './model/bankHoliday.class';
import { Departure } from './model/departure.class';
import { DirectionsEnum } from './model/directions.enum';
import { TransportTypeEnum } from './model/transport-type.enum';
import { FormatWhenPipe } from './pipes/format-when.pipe';
import { fadeInAnimation } from './fade-in.animation';
import { ActionsButtonGroupComponent } from './actions-button-group/actions-button-group.component';



@NgModule({
  declarations: [
    DepartureListBoxComponent,
    // BankHoliday,
    // Departure,
    FormatWhenPipe,
    ActionsButtonGroupComponent,
    LineRouteComponent,
    StopDetailComponent
    // fadeInAnimation
  ],
  imports : [
    CommonModule,
    FormsModule,
    MyDatePickerModule,
    TooltipModule.forRoot()
  ],
  exports: [
    DepartureListBoxComponent,
    ActionsButtonGroupComponent,
    LineRouteComponent,
    StopDetailComponent,
    // BankHoliday,
    // Departure,
    FormatWhenPipe,
    // fadeInAnimation
    // DirectionsEnum,
    // TransportTypeEnum
  ]
})

export class SharedModule {}
