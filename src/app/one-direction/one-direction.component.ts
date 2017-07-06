import { Component, OnInit } from '@angular/core';
import { Response } from '@angular/http';
import {ActivatedRoute, Data, Params} from '@angular/router';
import * as moment from 'moment';

import { Departure } from '../shared/model/departure.class';
import { DirectionsEnum } from '../shared/model/directions.enum';
import { DirectionLabels } from '../shared/model/direction-labels.constant';

import { DateUtilsService } from '../shared/services/date-utils.service';
import { DataService } from '../shared/services/data.service';
import { DeparturesService } from '../shared/services/departures.service';
import { fadeInAnimation } from '../shared/fade-in.animation';


@Component({
  selector: 'app-one-direction',
  templateUrl: './one-direction.component.html',
  styleUrls: ['./one-direction.component.scss'],
  animations: [fadeInAnimation],
  host: { '[@fadeInAnimation]': ''}
})
export class OneDirectionComponent implements OnInit {

  bankHolidayListResponse: Response;

  //Line data
  bus684LinePubtraResponse;
  trainC2LinePubtraResponse;

  //Next departures arrays
  busDepartures:Array<Departure>;
  trainDepartures:Array<Departure>;
  mixDepartures: Array<Departure>;

  directionSelected:number = DirectionsEnum.CercedillaMadrid;
  directionSelectedLabel:string;
  dateParam:string;
  dateSelected;
  dateSelectedLabel:string;

  constructor(private route:ActivatedRoute,
              private dateUtilsService: DateUtilsService,
              private departuresService: DeparturesService,
              private dataService: DataService,
            ) { }

  ngOnInit() {
    //Get direction from route params
    this.directionSelected = parseInt(this.route.snapshot.params['direction']);
    this.directionSelectedLabel = DirectionLabels[this.directionSelected];

    //Parse date from route params
    this._parseParamDate();


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

        this._updateMixDepartures();

        this.route.params.subscribe(
         (params: Params) => {
           this._parseParamDate();
           this._updateMixDepartures();
         });


      },
      (error) => console.log(error)
    );


  }

  /**
  * Parse date selected from route params
  */
  _parseParamDate() {
    this.dateParam = this.route.snapshot.params['date'];
    const tokens = this.route.snapshot.params['date'].split('-');
    const day = parseInt(tokens[0]);
    const month = parseInt(tokens[1]);
    const year = parseInt(tokens[2]);
    this.dateSelected = moment().set({'year': year, 'month': month-1 , 'date': day , 'hour': 0, 'minute': 0});
    this.dateSelectedLabel = this.dateSelected.locale('es').format('dddd, D [de] MMMM [de] YYYY');
    this.dataService.dateSelected = this.dateSelected;
  }

  /**
  * @name _updateMixDepartures
  * @description Set departures model to next departures (ALL)
  */

  _updateMixDepartures() {
    this.mixDepartures = this.departuresService.buildMixDepaturesFromMoment(this.dateSelected,
                                                                            this.directionSelected,
                                                                            this.trainC2LinePubtraResponse,
                                                                            this.bus684LinePubtraResponse);
    if(this.mixDepartures && this.mixDepartures.length > 0) {
      setTimeout(()=>{
        //Notify view by observable subject
        this.dataService.mixDepartures.next(this.mixDepartures);
      },50);
    }
  }

}
