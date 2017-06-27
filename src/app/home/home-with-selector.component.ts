import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Response } from '@angular/http';
import 'rxjs/Rx';
import {ActivatedRoute, Data} from '@angular/router';
import * as moment from 'moment';
import * as _ from "lodash";

import { DateUtilsService } from '../shared/date-utils.service';
import { DeparturesService } from '../shared/departures.service';
import { DataService } from '../shared/data.service';
import { Departure } from '../model/departure.class';
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
              private departuresService: DeparturesService,
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
    this.dataService.getAllLinesData().subscribe(
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

        this.dataService.directionSelected = this.directionSelected;

        this._updateMixDepartures();


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
          this.dataService.directionSelected = choiceSelected.code;
          this._updateMixDepartures();
        },50);
      }
    );

  }

  _updateMixDepartures() {
    this.showNoDataAvailable = false;
    this.mixDepartures = this.departuresService.buildMixDepaturesFromMoment(moment(),
                                                                            this.directionSelected,
                                                                            this.trainC2TimetableResponse,
                                                                            this.bus684TimetableResponse,
                                                                            this.bus684StationStartCercedilla,
                                                                            this.bus684StationEndMadrid,
                                                                            this.trainC2StationStartCercedilla,
                                                                            this.trainC2StationEndMadrid);
    if(this.mixDepartures && this.mixDepartures.length > 0) {
      setTimeout(()=>{
        //Notify view by observable subject
        this.dataService.mixDepartures.next(this.mixDepartures);
      },50);
    } else {
      this.showNoDataAvailable = true;
    }
  }

}
