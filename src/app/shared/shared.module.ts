import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DepartureListBoxComponent } from './departure-list-box/departure-list-box.component';

import { BankHoliday } from './model/bankHoliday.class';
import { Departure } from './model/departure.class';
import { DirectionsEnum } from './model/directions.enum';
import { TransportTypeEnum } from './model/transport-type.enum';
import { FormatWhenPipe } from './pipes/format-when.pipe';


@NgModule({
  declarations: [
    DepartureListBoxComponent,
    // BankHoliday,
    // Departure,
    FormatWhenPipe
  ],
  imports : [
    CommonModule
  ],
  exports: [
    DepartureListBoxComponent,
    // BankHoliday,
    // Departure,
    FormatWhenPipe
    // DirectionsEnum,
    // TransportTypeEnum
  ]
})

export class SharedModule {}
