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
  dateSelected = moment();

  private dateSelectedDP: Object = { date: { year: this.dateSelected.get('year'), month: this.dateSelected.get('month')+1, day: this.dateSelected.get('date') } };


  dateSelectedLabel:string = "de Hoy";

  nowDateLabel = this.dateSelected.locale('es').format('dddd, D [de] MMMM [de] YYYY');
  private nowDayPicker: IMyDate = { year: this.dateSelected.get('year'), month: this.dateSelected.get('month')+1, day: this.dateSelected.get('date') };
  private myDatePickerOptions: IMyDpOptions = {
      // other options...
      dateFormat: 'dd-mm-yyyy',
      showClearDateBtn: false,
      disableUntil: this.nowDayPicker,
      editableDateField: false,
      alignSelectorRight:true,
      yearSelector:true,
      maxYear:this.dateSelected.get('year'),
      openSelectorTopOfInput:true,
      showSelectorArrow:false

  };

  // Initialize selector state to false
  private selector: IMySelector = {
      open: false
  };

  // Define the view child variable
  @ViewChild('mydp') mydp: MyDatePicker;

  showNoDataAvailable:boolean = false;

  constructor(private route:ActivatedRoute,
              private router: Router,
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


  // dateChanged callback function called when the user select the date. This is mandatory callback
  // in this option. There are also optional inputFieldChanged and calendarViewChanged callbacks.
  onDateChanged(event: IMyDateModel) {
      // event properties are: event.date, event.jsdate, event.formatted and event.epoc
      console.log('onDateChanged(): ', event.date, ' - jsdate: ', new Date(event.jsdate).toLocaleDateString(), ' - formatted: ', event.formatted, ' - epoc timestamp: ', event.epoc);
      this.dateSelected.set('date',event.date.day);
      this.dateSelected.set('month',event.date.month-1);
      this.dateSelected.set('year',event.date.year);
      // this.nowDateLabel = this.daySelected.locale('es').format('dddd, D [de] MMMM [de] YYYY');
      //Notify listeners
      // this.dataService.newDateSelected.next(this.dateSelected);
      this.gotoMixDirectionSelected();
  }

  // Calling this function opens the selector if it is closed and
  // closes the selector if it is open
  // onToggleSelector(event: any) {
  //     // event.stopPropagation();
  //     this.mydp.openBtnClicked();
  // }
  //
  openSelector() {
    this.selector = {
        open: true
    };
  }
  //
  // closeSelector() {
  //     this.selector = {
  //         open: false
  //     };
  // }

  /**
  * @name _updateMixDepartures
  * @description Set departures model to next 6 departures
  */
  _updateMixDepartures() {
    this.showNoDataAvailable = false;
    this.mixDepartures = this.departuresService.buildMixDepaturesFromMoment(this.dateSelected,
                                                                            this.directionSelected,
                                                                            this.trainC2TimetableResponse,
                                                                            this.bus684TimetableResponse,
                                                                            this.bus684StationStartCercedilla,
                                                                            this.bus684StationEndMadrid,
                                                                            this.trainC2StationStartCercedilla,
                                                                            this.trainC2StationEndMadrid,
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
