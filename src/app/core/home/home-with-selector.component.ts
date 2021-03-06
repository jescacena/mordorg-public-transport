import { Component, OnInit, OnDestroy,ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Response } from '@angular/http';
import 'rxjs/Rx';
import {ActivatedRoute, Router,Data,NavigationStart,NavigationEnd} from '@angular/router';
import * as moment from 'moment';
import * as _ from "lodash";
import {IMyDpOptions,IMyDate,IMyDateModel,IMySelector,MyDatePicker} from 'mydatepicker';



import { DateUtilsService } from '../../shared/services/date-utils.service';
import { DeparturesService } from '../../shared/services/departures.service';
import { DataService } from '../../shared/services/data.service';
import { CacheService } from '../../shared/services/cache.service';
import { Departure } from '../../shared/model/departure.class';
import { DirectionsEnum } from '../../shared/model/directions.enum';
import { DeviceTypeEnum } from '../../shared/model/device-type.enum';
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
export class HomeWithSelectorComponent implements OnInit, OnDestroy {

  bankHolidayListResponse: Response;

  //Line data
  bus684LinePubtraResponse;
  bus680LinePubtraResponse;
  trainC2LinePubtraResponse;
  trainC9LinePubtraResponse;
  trainRegSegLinePubtraResponse;
  busPiscinasLinePubtraResponse;
  busUrbanLinePubtraResponse;

  //Next departures arrays
  busDepartures:Array<Departure>;
  trainDepartures:Array<Departure>;
  mixDepartures: Array<Departure>;

  directionSelected:number = DirectionsEnum.CercedillaMadrid;
  dateSelected = moment();

  private dateSelectedDP: Object = { date: { year: this.dateSelected.get('year'), month: this.dateSelected.get('month')+1, day: this.dateSelected.get('date') } };


  dateSelectedLabel:string = "de Hoy";

  nowDateLabel = this.dateSelected.locale('es').format('dddd, D [de] MMMM [de] YYYY');
  nowTimeLabel = this.dateSelected.locale('es').format('HH:mm A');


  showNoDataAvailable:boolean = false;
  showButtonGroup:boolean = true;

  refreshListInterval = Observable.interval(60000);
  refreshSubscription;

  deviceType = DeviceTypeEnum.Desktop;

  numOfDeparturesToShow = 6;


  constructor(private route:ActivatedRoute,
              private router: Router,
              private dateUtilsService: DateUtilsService,
              private departuresService: DeparturesService,
              private dataService: DataService,
              private cacheService: CacheService,
              private homeService: HomeService) { }


  ngOnInit() {

    this.dataService.closeNavMenu.next();
    this.dataService.hidePageTransitionSpinner.next();

    this.deviceType = this.dataService.getDeviceType();

    // this.numOfDeparturesToShow = 4;
    this.numOfDeparturesToShow = (this.deviceType === DeviceTypeEnum.MobileHandset)? this.numOfDeparturesToShow-2 : this.numOfDeparturesToShow ;

    this.directionSelected = (this.route.snapshot.params['direction'])?
                              parseInt(this.route.snapshot.params['direction'])
                              :
                              DirectionsEnum.CercedillaMadrid;

    this.dataService.newDirectionSelected.next(this.directionSelected);

    console.log('Home - directionSelected',this.directionSelected);


    this.router.events.subscribe(
      (event) => {
        if(event instanceof NavigationStart) {
          this.dataService.closeNavMenu.next();
          this.dataService.showPageTransitionSpinner.next();
        }
        if(event instanceof NavigationEnd) {
          this.dataService.hidePageTransitionSpinner.next();
        }
        // NavigationEnd
        // NavigationCancel
        // NavigationError
        // RoutesRecognized
    });

    //Resolve bank holidays and init dateUtilsService
    this.route.data.subscribe(
       (data: Data) => {
         this.bankHolidayListResponse = data['bankHolidayListResponse'];
         this.dateUtilsService.setBankHolydays(this.bankHolidayListResponse.json().day_list);
       }
    );
    console.log('Home - bankHolidayList',this.bankHolidayListResponse.json().day_list);

    if(!this.route.snapshot.params['direction']) {
      //Fetch  departures from common routes
      this.dataService.getAllLinesData().subscribe(
        (dataArray: Array<Response>) => {
          this.trainC2LinePubtraResponse = dataArray[0].json()[0];
          this.trainC9LinePubtraResponse = dataArray[1].json()[0];
          this.bus684LinePubtraResponse = dataArray[2].json()[0];
          this.busPiscinasLinePubtraResponse = dataArray[3].json()[0];

          //Save to cache line data
          this.cacheService.addLineDataToCache(this.trainC2LinePubtraResponse,this.trainC2LinePubtraResponse.type);
          this.cacheService.addLineDataToCache(this.trainC9LinePubtraResponse,this.trainC9LinePubtraResponse.type);
          this.cacheService.addLineDataToCache(this.bus684LinePubtraResponse,this.bus684LinePubtraResponse.type);
          this.cacheService.addLineDataToCache(this.busPiscinasLinePubtraResponse,this.busPiscinasLinePubtraResponse.type);
          console.log('Home onChoiceSelect cached data for lines-->');
          console.table(this.cacheService.lineCacheList)

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
                  this.cacheService.addLineDataToCache(jsonData,jsonData.type);
                  console.table(this.cacheService.lineCacheList)
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
      } else if(this.directionSelected === DirectionsEnum.CercedillaHospitalVillalba ||
                this.directionSelected === DirectionsEnum.HospitalVillalbaCercedila) {

                  this.dataService.mixDepartures.next([]);

                  if(!this.cacheService.lineCacheList['line-pubtra-680']) {
                    this.dataService.getBusLineData('680').subscribe(
                      (data: Response) => {
                        //Save to cache line data
                        const jsonData = data.json()[0];
                        this.bus680LinePubtraResponse = jsonData;
                        this.cacheService.addLineDataToCache(jsonData,jsonData.type);
                        console.table(this.cacheService.lineCacheList)
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

      } else if(this.directionSelected === DirectionsEnum.CercedillaCotos ||
                this.directionSelected === DirectionsEnum.CotosCercedilla) {

          this.dataService.mixDepartures.next([]);

          if(!this.cacheService.lineCacheList['line-pubtra-c9']) {
            this.dataService.getTrainLineData('c9').subscribe(
              (data: Response) => {
                //Save to cache line data
                const jsonData = data.json()[0];
                this.trainC9LinePubtraResponse = jsonData;
                this.cacheService.addLineDataToCache(jsonData,jsonData.type);
                console.table(this.cacheService.lineCacheList)
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
      } else if(this.directionSelected === DirectionsEnum.CercedillaSegovia ||
                this.directionSelected === DirectionsEnum.SegoviaCercedilla) {

          this.dataService.mixDepartures.next([]);

          if(!this.cacheService.lineCacheList['line-pubtra-regseg']) {
            this.dataService.getTrainLineData('regseg').subscribe(
              (data: Response) => {
                //Save to cache line data
                const jsonData = data.json()[0];
                this.trainRegSegLinePubtraResponse = jsonData;
                this.cacheService.addLineDataToCache(jsonData,jsonData.type);
                console.table(this.cacheService.lineCacheList)
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
            this.trainC9LinePubtraResponse = dataArray[1].json()[0];
            this.bus684LinePubtraResponse = dataArray[2].json()[0];
            this.busPiscinasLinePubtraResponse = dataArray[3].json()[0];

            //Save to cache line data
            this.cacheService.addLineDataToCache(this.trainC2LinePubtraResponse,this.trainC2LinePubtraResponse.type);
            this.cacheService.addLineDataToCache(this.bus684LinePubtraResponse,this.bus684LinePubtraResponse.type);
            this.cacheService.addLineDataToCache(this.busPiscinasLinePubtraResponse,this.busPiscinasLinePubtraResponse.type);
            console.log('Home - onChoiceSelect cached data for lines-->');
            console.table(this.cacheService.lineCacheList)

            this.dataService.directionSelected = this.directionSelected;

            this._updateMixDepartures();

          },
          (error) => console.log(error)
        );

      }

    }

    //Init refresh loop (every minute)
    this.refreshSubscription = this.refreshListInterval.subscribe(
      (number: number) => {
        this.dateSelected = moment();
        this.dateSelectedDP = { date: { year: this.dateSelected.get('year'), month: this.dateSelected.get('month')+1, day: this.dateSelected.get('date') } };
        this.nowDateLabel = this.dateSelected.locale('es').format('dddd, D [de] MMMM [de] YYYY');
        this.nowTimeLabel = this.dateSelected.locale('es').format('HH:mm A');
        this._updateMixDepartures();
      }
    );


    this.dataService.newDirectionSelected.subscribe(
      (choiceSelected:any)=> {
        const self = this;
        setTimeout(()=>{
          if(choiceSelected.code || choiceSelected.code === 0) {
            this.directionSelected = choiceSelected.code;
            this.dataService.directionSelected = choiceSelected.code;
            this._updateMixDepartures();
          }
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

  ngOnDestroy() {
    this.refreshSubscription.unsubscribe();
  }


  /**
  * @name _updateMixDepartures
  * @description Set departures model to next 6 departures
  */
  _updateMixDepartures() {
    this.showNoDataAvailable = false;
    this.showButtonGroup = true;
    let busResponse;
    let trainResponse;

    switch(this.directionSelected) {
      case DirectionsEnum.CercedillaCotos:
        trainResponse = this.trainC9LinePubtraResponse;
        break;
      case DirectionsEnum.CercedillaSegovia:
        // trainResponse = this.trainRegSegLinePubtraResponse;
        trainResponse = this.cacheService.lineCacheList['line-pubtra-regseg'];

        break;
      case DirectionsEnum.CercedillaMadrid:
      case DirectionsEnum.MadridCercedilla:
        busResponse = this.bus684LinePubtraResponse;
        trainResponse = this.trainC2LinePubtraResponse;
        break;
      case DirectionsEnum.CercedillaHospitalVillalba:
        busResponse = this.cacheService.lineCacheList['line-pubtra-680'];
        break;
      case DirectionsEnum.HospitalVillalbaCercedila:
        busResponse = this.cacheService.lineCacheList['line-pubtra-680'];
        break;
      case DirectionsEnum.CercedillaPiscinasBerceas:
        busResponse = this.busPiscinasLinePubtraResponse;
        break;
      case DirectionsEnum.CotosCercedilla:
        trainResponse = this.trainC9LinePubtraResponse;
        break;
      case DirectionsEnum.SegoviaCercedilla:
        // trainResponse = this.trainRegSegLinePubtraResponse;
        trainResponse = this.cacheService.lineCacheList['line-pubtra-regseg'];
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
        return;
    }



    if(this.directionSelected || this.directionSelected === 0) {
      this.mixDepartures = this.departuresService.buildMixDepaturesFromMoment(this.dateSelected,
                                                                              this.directionSelected,
                                                                              trainResponse,
                                                                              busResponse,
                                                                              this.numOfDeparturesToShow);
      if(this.mixDepartures && this.mixDepartures.length > 0) {
        setTimeout(()=>{
          //Notify view by observable subject
          this.dataService.mixDepartures.next(this.mixDepartures);
        },50);
      } else {
        if(
          this.directionSelected !== DirectionsEnum.PiscinasBerceasCercedilla &&
          this.directionSelected !== DirectionsEnum.CercedillaPiscinasBerceas &&
          this.directionSelected !== DirectionsEnum.CercedillaHospitalVillalba &&
          this.directionSelected !== DirectionsEnum.HospitalVillalbaCercedila
        ){
          this.showButtonGroup = false;

        }
        this.showNoDataAvailable = true;
      }
    }
  }

  gotoMixDirectionSelected() {
   this.router.navigate(['one-direction', this.dataService.directionSelected, this.dateSelected.format('DD-MM-YYYY')]);
  }

}
