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
import { DirectionsEnum } from '../model/directions.enum';



@Component({
  selector: 'app-home-with-selector',
  templateUrl: './home-with-selector.component.html',
  styleUrls: ['./home-with-selector.component.scss'],
  providers: [HomeService]
})
export class HomeWithSelectorComponent implements OnInit {

  bankHolidayListResponse: Response;

  //Line data
  bus684LinePubtraResponse;
  trainC2LinePubtraResponse;

  //Timetables for bus 684 and train c2
  bus684TimetableResponse;
  trainC2TimetableResponse;

  //Stations start and end
  bus684StationStartCercedilla;
  bus684StationEndMadrid;
  trainC2StationStartCercedilla;
  trainC2StationEndMadrid;

  //Next departures arrays
  busDepartures:Array<Departure>;
  trainDepartures:Array<Departure>;
  mixDepartures: Array<Departure>;

  directionSelected:number = DirectionsEnum.CercedillaMadrid;

  showNoDataAvailable:boolean = false;

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
    this.homeService.getAllLinesData().subscribe(
      (dataArray: Array<Response>) => {
        console.log('JES getAllTimetables respondataArrays 0-->', dataArray[0].json()[0]);
        console.log('JES getAllTimetables respondataArrays 1-->', dataArray[1].json()[0]);
        this.trainC2LinePubtraResponse = dataArray[0].json()[0];
        this.bus684LinePubtraResponse = dataArray[1].json()[0];

        //Set timetables
        this.trainC2TimetableResponse = this.trainC2LinePubtraResponse.timetable[0];
        this.bus684TimetableResponse = this.bus684LinePubtraResponse.timetable[0];

        //Set limit Stations
        this.bus684StationStartCercedilla = this.bus684LinePubtraResponse.station_start[0];
        this.bus684StationEndMadrid = this.bus684LinePubtraResponse.station_end[0];
        this.trainC2StationStartCercedilla = this.trainC2LinePubtraResponse.station_start[0];
        this.trainC2StationEndMadrid = this.trainC2LinePubtraResponse.station_end[0];

        this._buildMixDepaturesFromMoment(moment());
      },
      (error) => console.log(error)
    );

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

    this.dataService.newDirectionSelected.subscribe(
      (choiceSelected:any)=> {
        const self = this;
        setTimeout(()=>{
          this.directionSelected = choiceSelected.code;
          this._buildMixDepaturesFromMoment(moment());
        },50);
      }
    );

  }

  _buildMixDepaturesFromMoment(momentDate) {
    // this.homeService.buildMixDepartures(dataArray,now);
    this.showNoDataAvailable = false;

    switch(this.directionSelected) {
      case DirectionsEnum.CercedillaMadrid:
        //Train
        const trainTodayDeparturesC2A = this.dateUtilsService.parseTrainTimeTableByDate(this.trainC2TimetableResponse,'C2A',momentDate);
        this.trainDepartures = this.dateUtilsService.getNextDepartures(momentDate, trainTodayDeparturesC2A, 3);
        //Bus 684
        const busTodayDeparturesC2M = this.dateUtilsService.parseBusTimeTableByDate(this.bus684TimetableResponse,'C2M',momentDate);
        this.busDepartures = this.dateUtilsService.getNextDepartures(momentDate, busTodayDeparturesC2M, 3);

        //Set place station start
        for(let depart of this.busDepartures) {
          depart.placeLabel = this.bus684StationStartCercedilla.direccion;
          depart.placeLink = "http://maps.google.com/?q="+this.bus684StationStartCercedilla.latlon;
        }
        //Set place station start
        for(let depart of this.trainDepartures) {
          depart.placeLabel = this.trainC2StationStartCercedilla.direccion;
          depart.placeLink = "http://maps.google.com/?q="+this.trainC2StationStartCercedilla.latlon;
        }

        //Concat train and bus in mixed
        this.mixDepartures = this.busDepartures.concat(this.trainDepartures);
        break;

      case DirectionsEnum.MadridCercedilla:
        const trainTodayDeparturesA2C = this.dateUtilsService.parseTrainTimeTableByDate(this.trainC2TimetableResponse,'A2C',momentDate);
        this.trainDepartures = this.dateUtilsService.getNextDepartures(momentDate, trainTodayDeparturesA2C, 3);

        const busTodayDeparturesM2C = this.dateUtilsService.parseBusTimeTableByDate(this.bus684TimetableResponse,'M2C',momentDate);
        this.busDepartures = this.dateUtilsService.getNextDepartures(momentDate, busTodayDeparturesM2C, 3);

        //Set place station start
        for(let depart of this.busDepartures) {
          depart.placeLabel = this.bus684StationEndMadrid.direccion;
          depart.placeLink = "http://maps.google.com/?q="+this.bus684StationEndMadrid.latlon;
        }
        //Set place station start
        for(let depart of this.trainDepartures) {
          depart.placeLabel = this.trainC2StationEndMadrid.direccion;
          depart.placeLink = "http://maps.google.com/?q="+this.trainC2StationEndMadrid.latlon;
        }

        //Concat train and bus in mixed
        this.mixDepartures = this.busDepartures.concat(this.trainDepartures);
        break;

      default:
        console.log('Direction '+this.directionSelected+'not available!');
        this.mixDepartures = null;
        this.showNoDataAvailable = true;
        break;
    }

    if(this.mixDepartures) {
      //Sort ascending
      this.mixDepartures.sort(function(a, b) {
        return a.momentDate.isAfter(b.momentDate);
      });
      console.log('JES this.mixDepartures',this.mixDepartures);
      setTimeout(()=>{
        this.dataService.mixDepartures.next(this.mixDepartures);
      },50);
    }



  }

}
