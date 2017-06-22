import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import {ActivatedRoute, Data} from '@angular/router';
import { DateUtilsService } from '../shared/date-utils.service';
import { DataService } from '../shared/data.service';
import { Response } from '@angular/http';

import { Departure } from '../model/departure.class';

import * as moment from 'moment';

import * as _ from "lodash";

import { HomeService } from './home.service';




@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [HomeService]
})
export class HomeComponent implements OnInit {

  bankHolidayListResponse: Response;

  //Timetables for bus 684 and train c2
  bus684TimetableResponse: Response;
  trainC2TimetableResponse: Response;

  //Next departures arrays
  departsBus684CerceMadrid:Array<Departure>;
  departsBus684MadridCerce:Array<Departure>;
  departsTrainC2CerceMadrid:Array<Departure>;
  departsTrainC2MadridCerce:Array<Departure>;

  departsCerceMadrid: Array<Departure>;
  departsMadridCerce: Array<Departure>;

  constructor(private route:ActivatedRoute,
              private dateUtilsService: DateUtilsService,
              private dataService: DataService,
              private homeService: HomeService) { }

  ngOnInit() {

    //Resolve bank holidays and init dateUtilsService
    this.route.data.subscribe(
       (data: Data) => {
         this.bankHolidayListResponse = data['bankHolidayListResponse'];
         this.dateUtilsService.setBankHolydays(this.bankHolidayListResponse.json().day_list);
       }
    );
    console.log('JES this.bankHolidayList',this.bankHolidayListResponse.json().day_list);

    //TODO Fetch initial next departures
    // this.homeService.getAllTimetables().subscribe(
    //   (dataArray: Array<Response>) => {
    //     console.log('JES getAllTimetables respondataArrays-->', dataArray);
    //     this.trainC2TimetableResponse = dataArray[0].json()[0];
    //     this.bus684TimetableResponse = dataArray[1].json()[0];
    //     this._buildMixDepaturesFromMoment(moment());
    //   },
    //   (error) => console.log(error)
    // );

    //Init refresh loop
    // const refreshLoop = Observable.interval(1*60*1000);   //Every minute
    // refreshLoop.subscribe(
    //   (number: number) => {
    //     console.log('Fetching updated next departures...');
    //
    //     //TODO get next departures from now
    //     this._buildMixDepaturesFromMoment(moment());
    //   }
    // );

  }

  _buildMixDepaturesFromMoment(momentDate) {
    // this.homeService.buildMixDepartures(dataArray,now);

    //Train
    const trainTodayDeparturesC2A = this.dateUtilsService.parseTrainTimeTableByDate(this.trainC2TimetableResponse,'C2A',momentDate);
    this.departsTrainC2CerceMadrid = this.dateUtilsService.getNextDepartures(momentDate, trainTodayDeparturesC2A, 5);

    const trainTodayDeparturesA2C = this.dateUtilsService.parseTrainTimeTableByDate(this.trainC2TimetableResponse,'A2C',momentDate);
    this.departsTrainC2MadridCerce = this.dateUtilsService.getNextDepartures(momentDate, trainTodayDeparturesA2C, 5);

    //Bus 684
    const busTodayDeparturesC2M = this.dateUtilsService.parseBusTimeTableByDate(this.bus684TimetableResponse,'C2M',momentDate);
    this.departsBus684CerceMadrid = this.dateUtilsService.getNextDepartures(momentDate, busTodayDeparturesC2M, 5);
    const busTodayDeparturesM2C = this.dateUtilsService.parseBusTimeTableByDate(this.bus684TimetableResponse,'M2C',momentDate);
    this.departsBus684MadridCerce = this.dateUtilsService.getNextDepartures(momentDate, busTodayDeparturesM2C, 5);

    console.log('JES this.departsBus684CerceMadrid',this.departsBus684CerceMadrid);
    console.log('JES this.departsBus684MadridCerce',this.departsBus684MadridCerce);
    console.log('JES this.departsTrainC2CerceMadrid',this.departsTrainC2CerceMadrid);
    console.log('JES this.departsTrainC2MadridCerce',this.departsTrainC2MadridCerce);

    //Concat CerceMadrid
    this.departsCerceMadrid = this.departsBus684CerceMadrid.concat(this.departsTrainC2CerceMadrid);
    this.departsCerceMadrid.sort(function(a, b) {
      return a.momentDate.isAfter(b.momentDate);
    });
    this.departsMadridCerce = this.departsBus684MadridCerce.concat(this.departsTrainC2MadridCerce);
    this.departsMadridCerce.sort(function(a, b) {
      return a.momentDate.isAfter(b.momentDate);
    });
    console.log('JES this.departsCerceMadrid',this.departsCerceMadrid);
    console.log('JES this.departsMadridCerce',this.departsMadridCerce);

    this.dataService.mixDeparturesCerceMadrid.next(this.departsCerceMadrid);
    this.dataService.mixDeparturesMadridCerce.next(this.departsMadridCerce);


  }

}
