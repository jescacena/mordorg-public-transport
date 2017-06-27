import { Component, OnInit } from '@angular/core';
import { Response } from '@angular/http';
import {ActivatedRoute, Data} from '@angular/router';
import * as moment from 'moment';

import { Departure } from '../model/departure.class';
import { DirectionsEnum } from '../model/directions.enum';
import { DateUtilsService } from '../shared/date-utils.service';
import { DataService } from '../shared/data.service';
import { DeparturesService } from '../shared/departures.service';

@Component({
  selector: 'app-one-direction',
  templateUrl: './one-direction.component.html',
  styleUrls: ['./one-direction.component.css']
})
export class OneDirectionComponent implements OnInit {

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

  constructor(private route:ActivatedRoute,
              private dateUtilsService: DateUtilsService,
              private departuresService: DeparturesService,
              private dataService: DataService,
            ) { }

  ngOnInit() {
    this.directionSelected = parseInt(this.route.snapshot.params['direction']);

    //Resolve bank holidays and init dateUtilsService
    this.route.data.subscribe(
       (data: Data) => {
         this.bankHolidayListResponse = data['bankHolidayListResponse'];
         this.dateUtilsService.setBankHolydays(this.bankHolidayListResponse.json().day_list);
       }
    );
    console.log('JES this.bankHolidayList',this.bankHolidayListResponse.json().day_list);

    //Fetch initial next departures
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

        this._updateMixDepartures();

      },
      (error) => console.log(error)
    );


  }

  _updateMixDepartures() {
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
    }
  }

}
