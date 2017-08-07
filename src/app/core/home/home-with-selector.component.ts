import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Response } from '@angular/http';
import 'rxjs/Rx';
import {ActivatedRoute, Router,Data} from '@angular/router';
import * as moment from 'moment';
import * as _ from "lodash";
import {IMyDpOptions,IMyDate,IMyDateModel,IMySelector,MyDatePicker} from 'mydatepicker';


import { DateUtilsService } from '../../shared/services/date-utils.service';
import { DeparturesService } from '../../shared/services/departures.service';
import { DataService } from '../../shared/services/data.service';
import { CacheService } from '../../shared/services/cache.service';
import { Departure } from '../../shared/model/departure.class';
import { DirectionsEnum } from '../../shared/model/directions.enum';
import { fadeInAnimation } from '../../shared/fade-in.animation';


import { HomeService } from './home.service';


@Component({
  selector: 'app-home-with-selector',
  templateUrl: './home-with-selector.component.html',
  styleUrls: ['./home-with-selector.component.scss'],
  animations: [fadeInAnimation],
  host: { '[@fadeInAnimation]': ''},
  providers: [HomeService]
})
export class HomeWithSelectorComponent implements OnInit {

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

  directionSelected:number;
  dateSelected = moment();

  private dateSelectedDP: Object = { date: { year: this.dateSelected.get('year'), month: this.dateSelected.get('month')+1, day: this.dateSelected.get('date') } };


  dateSelectedLabel:string = "de Hoy";

  nowDateLabel = this.dateSelected.locale('es').format('dddd, D [de] MMMM [de] YYYY');
  nowTimeLabel = this.dateSelected.locale('es').format('HH:mm A');


  showNoDataAvailable:boolean = false;

  constructor(private route:ActivatedRoute,
              private router: Router,
              private dateUtilsService: DateUtilsService,
              private departuresService: DeparturesService,
              private dataService: DataService,
              private cacheService: CacheService,
              private homeService: HomeService) { }

  ngOnInit() {

    this.directionSelected = (this.route.snapshot.params['direction'])?
                              parseInt(this.route.snapshot.params['direction'])
                              :
                              DirectionsEnum.CercedillaMadrid;

    this.dataService.newDirectionSelected.next(this.directionSelected);

    console.log('JES this.directionSelected',this.directionSelected);


    //Resolve bank holidays and init dateUtilsService
    this.route.data.subscribe(
       (data: Data) => {
         this.bankHolidayListResponse = data['bankHolidayListResponse'];
         this.dateUtilsService.setBankHolydays(this.bankHolidayListResponse.json().day_list);
       }
    );
    console.log('JES this.bankHolidayList',this.bankHolidayListResponse.json().day_list);

    if(!this.route.snapshot.params['direction']) {
      //Fetch  departures from common routes
      this.dataService.getAllLinesData().subscribe(
        (dataArray: Array<Response>) => {
          this.trainC2LinePubtraResponse = dataArray[0].json()[0];
          this.bus684LinePubtraResponse = dataArray[1].json()[0];
          this.busPiscinasLinePubtraResponse = dataArray[2].json()[0];

          //Save to cache line data
          this.cacheService.addLineDataToCache(this.trainC2LinePubtraResponse,this.trainC2LinePubtraResponse.type);
          this.cacheService.addLineDataToCache(this.bus684LinePubtraResponse,this.bus684LinePubtraResponse.type);
          this.cacheService.addLineDataToCache(this.busPiscinasLinePubtraResponse,this.busPiscinasLinePubtraResponse.type);
          console.log('JES cached data for lines-->', this.cacheService.lineCacheList);

          this.dataService.directionSelected = this.directionSelected;

          this._updateMixDepartures();

        },
        (error) => console.log(error)
      );
    } else {   //direction on path

      //Get uncached lines (L1)
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

                },
                (error) => console.log(error)
              );
            } else {
              this.dataService.directionSelected = this.directionSelected;
              //Notify listeners
              this.dataService.newDirectionSelected.next(this.directionSelected);

              this._updateMixDepartures();

            }
      } else {
        //Fetch  departures from common routes
        this.dataService.getAllLinesData().subscribe(
          (dataArray: Array<Response>) => {
            this.trainC2LinePubtraResponse = dataArray[0].json()[0];
            this.bus684LinePubtraResponse = dataArray[1].json()[0];
            this.busPiscinasLinePubtraResponse = dataArray[2].json()[0];

            //Save to cache line data
            this.cacheService.addLineDataToCache(this.trainC2LinePubtraResponse,this.trainC2LinePubtraResponse.type);
            this.cacheService.addLineDataToCache(this.bus684LinePubtraResponse,this.bus684LinePubtraResponse.type);
            this.cacheService.addLineDataToCache(this.busPiscinasLinePubtraResponse,this.busPiscinasLinePubtraResponse.type);
            console.log('JES cached data for lines-->', this.cacheService.lineCacheList);

            this.dataService.directionSelected = this.directionSelected;

            this._updateMixDepartures();

          },
          (error) => console.log(error)
        );

      }

    }

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
    this.dataService.newDateSelected.subscribe(
      (dateSelected:any)=> {
        const self = this;
        setTimeout(()=>{
          this.dateSelected = dateSelected;
          this.dataService.dateSelected = dateSelected;
          // let daySelectedAux = moment();
          // daySelectedAux.set('date',dateSelected.get('hour'));
          // daySelectedAux.set('month',dateSelected.get('month'));
          // daySelectedAux.set('year',dateSelected.get('year'));
          //
          // this.dateSelectedLabel = " del " + daySelectedAux.locale('es').format('dddd, D [de] MMMM [de] YYYY');

          this._updateMixDepartures();
        },50);
      }
    );




  }


  /**
  * @name _updateMixDepartures
  * @description Set departures model to next 6 departures
  */
  _updateMixDepartures() {
    this.showNoDataAvailable = false;
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
                                                                            busResponse,
                                                                            6);
    if(this.mixDepartures && this.mixDepartures.length > 0) {
      setTimeout(()=>{
        //Notify view by observable subject
        this.dataService.mixDepartures.next(this.mixDepartures);
      },50);
    } else {
      this.showNoDataAvailable = true;
    }
  }

  gotoMixDirectionSelected() {
   this.router.navigate(['one-direction', this.dataService.directionSelected, this.dateSelected.format('DD-MM-YYYY')]);
  }

}
