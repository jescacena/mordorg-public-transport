import { Component, OnInit } from '@angular/core';
import { Response } from '@angular/http';
import {ActivatedRoute, Data, Params} from '@angular/router';
import * as moment from 'moment';

import { Departure } from '../shared/model/departure.class';
import { DirectionsEnum } from '../shared/model/directions.enum';
import { DirectionLabels } from '../shared/model/direction-labels.constant';

import { DateUtilsService } from '../shared/services/date-utils.service';
import { DataService } from '../shared/services/data.service';
import { CacheService } from '../shared/services/cache.service';
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
  busPiscinasLinePubtraResponse;
  busUrbanLinePubtraResponse;

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
              private cacheService: CacheService,
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


    //Get lines data depending on selected direction
    if(this.directionSelected === DirectionsEnum.HospitalFuenfriaInstituto ||
            this.directionSelected === DirectionsEnum.InstitutoHospitalFuenfria) {
              this.dataService.mixDepartures.next([]);

              if(!this.cacheService.lineCacheList['line-pubtra-l1']) {
                this.dataService.getBusLineData('l1').subscribe(
                  (data: Response) => {
                    //Save to cache line data
                    const jsonData = data.json()[0];
                    this.busUrbanLinePubtraResponse = jsonData;
                    console.log('JES onChoiceSelect jsonData',jsonData);
                    this.cacheService.addLineDataToCache(jsonData,jsonData.type);
                    console.log('JES onChoiceSelect cached data for lines-->', this.cacheService.lineCacheList);
                    //
                    this.dataService.directionSelected = this.directionSelected;
                    //Notify listeners
                    this.dataService.newDirectionSelected.next(this.directionSelected);

                    this._updateMixDepartures();

                    this.route.params.subscribe(
                     (params: Params) => {
                       this._parseParamDate();
                       this._updateMixDepartures();
                     });


                  },
                  (error) => console.log(error)
                );
              } else {
                this.dataService.directionSelected = this.directionSelected;
                //Notify listeners
                this.dataService.newDirectionSelected.next(this.directionSelected);

                this._updateMixDepartures();
                this.route.params.subscribe(
                 (params: Params) => {
                   this._parseParamDate();
                   this._updateMixDepartures();
                 });

              }

    // } else if(this.directionSelected === DirectionsEnum.CercedillaPiscinasBerceas ||
    //         this.directionSelected === DirectionsEnum.PiscinasBerceasCercedilla) {
    } else {
      this.dataService.getAllLinesData().subscribe(
        (dataArray: Array<Response>) => {
          console.log('JES getAllTimetables respondataArrays 0-->', dataArray[0].json()[0]);
          console.log('JES getAllTimetables respondataArrays 1-->', dataArray[1].json()[0]);
          this.trainC2LinePubtraResponse = dataArray[0].json()[0];
          this.bus684LinePubtraResponse = dataArray[1].json()[0];
          this.busPiscinasLinePubtraResponse = dataArray[2].json()[0];

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
    let busResponse;
    switch(this.directionSelected) {
      case DirectionsEnum.CercedillaMadrid:
        busResponse = this.bus684LinePubtraResponse;
        break;
      case DirectionsEnum.CercedillaPiscinasBerceas:
        busResponse = this.busPiscinasLinePubtraResponse;
        break;
      case DirectionsEnum.MadridCercedilla:
        busResponse = this.bus684LinePubtraResponse;
        break;
      case DirectionsEnum.PiscinasBerceasCercedilla:
        busResponse = this.busPiscinasLinePubtraResponse;
        break;

      case DirectionsEnum.HospitalFuenfriaInstituto:
        busResponse = this.cacheService.lineCacheList['line-pubtra-l1'];
        break;
      case DirectionsEnum.InstitutoHospitalFuenfria:
        busResponse = this.cacheService.lineCacheList['line-pubtra-l1'];
        break;

      default:
        break;
    }

    this.mixDepartures = this.departuresService.buildMixDepaturesFromMoment(this.dateSelected,
                                                                            this.directionSelected,
                                                                            this.trainC2LinePubtraResponse,
                                                                            busResponse);
    if(this.mixDepartures && this.mixDepartures.length > 0) {
      setTimeout(()=>{
        //Notify view by observable subject
        this.dataService.mixDepartures.next(this.mixDepartures);
      },50);
    }
  }

}
