import { Component, OnInit } from '@angular/core';
import { Angulartics2GoogleAnalytics } from 'angulartics2';

import { DataService } from './shared/services/data.service';
import { DateUtilsService } from './shared/services/date-utils.service';
import { Response } from '@angular/http';
import { Departure } from './shared/model/departure.class';
import * as moment from 'moment';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [DataService,DateUtilsService]
})
export class AppComponent implements OnInit{
  title = 'app';

  // nowMoment = moment().add(6,'hours');
  nowMoment = moment();
  departsBus684CerceMadrid:Array<Departure>;
  departsBus684MadridCerce:Array<Departure>;
  departsTrainC2CerceMadrid:Array<Departure>;
  departsTrainC2MadridCerce:Array<Departure>;

  constructor(private dataService: DataService, private dateUtilsService:DateUtilsService, angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics) {}

  ngOnInit() {
    // this.dataService.getCCPOIS_BankHolidays(406).subscribe(
    //   (response: Response) => {
    //     const data = response.json();
    //     console.log('JES getCCPOIS_BankHolidays response-->', data);
    //     this.dateUtilsService.setBankHolydays(data.day_list);
    //   },
    //   (error) => console.log(error)
    // );
    //
    //
    // this.dataService.getCCPOIS_TrainTimetable('c2').subscribe(
    //   (response: Response) => {
    //     const data = response.json();
    //     console.log('JES getCCPOIS_TrainTimetable response-->', data);
    //     //Build departures from this day and tomorrow
    //
    //     const allDepartures684_C2M = this.dateUtilsService.parseTrainTimeTableByDate(data[0],'C2A',this.nowMoment);
    //     this.departsTrainC2CerceMadrid = this.dateUtilsService.getNextDepartures(this.nowMoment, allDepartures684_C2M, 5);
    //     console.log('JES departsTrainC2CerceMadrid-->', this.departsTrainC2CerceMadrid);
    //
    //     const allDepartures684_M2C = this.dateUtilsService.parseTrainTimeTableByDate(data[0],'A2C',this.nowMoment);
    //     this.departsTrainC2MadridCerce = this.dateUtilsService.getNextDepartures(this.nowMoment, allDepartures684_M2C, 5);
    //     console.log('JES departsTrainC2MadridCerce-->', this.departsTrainC2MadridCerce);
    //
    //   },
    //   (error) => console.log(error)
    // );
    //
    // this.dataService.getCCPOIS_BusTimetable('684').subscribe(
    //   (response: Response) => {
    //     const data = response.json();
    //     console.log('JES getCCPOIS_BusTimetable response-->', data);
    //     //Build departures from this day and tomorrow
    //
    //     const allDepartures684_C2M = this.dateUtilsService.parseBusTimeTableByDate(data[0],'C2M',this.nowMoment);
    //     this.departsBus684CerceMadrid = this.dateUtilsService.getNextDepartures(this.nowMoment, allDepartures684_C2M, 5);
    //     console.log('JES departsBus684CerceMadrid-->', this.departsBus684CerceMadrid);
    //
    //     const allDepartures684_M2C = this.dateUtilsService.parseBusTimeTableByDate(data[0],'M2C',this.nowMoment);
    //     this.departsBus684MadridCerce = this.dateUtilsService.getNextDepartures(this.nowMoment, allDepartures684_M2C, 5);
    //     console.log('JES departsBus684MadridCerce-->', this.departsBus684MadridCerce);
    //
    //   },
    //   (error) => console.log(error)
    // );



  }
}
