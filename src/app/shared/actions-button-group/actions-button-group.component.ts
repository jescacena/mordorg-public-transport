import { Component, OnInit, ViewChild, Input } from '@angular/core';
import * as moment from 'moment';
import {IMyDpOptions,IMyDate,IMyDateModel,IMySelector,MyDatePicker} from 'mydatepicker';
import {ActivatedRoute, Router,Data,Params} from '@angular/router';


import { DateUtilsService } from '../../shared/services/date-utils.service';
import { DeparturesService } from '../../shared/services/departures.service';
import { DataService } from '../../shared/services/data.service';



@Component({
  selector: 'app-actions-button-group',
  templateUrl: './actions-button-group.component.html',
  styleUrls: ['./actions-button-group.component.scss']
})
export class ActionsButtonGroupComponent implements OnInit {
  @Input() withToday: boolean;
  @Input() customClass: string;


  dateSelected: any;

  dateSelectedDP: Object;

  nowDayPicker: IMyDate;
  myDatePickerOptions: IMyDpOptions;

  // Initialize selector state to false
  private selector: IMySelector = {
      open: false
  };

  // Define the view child variable
  @ViewChild('mydp') mydp: MyDatePicker;


  constructor(private route:ActivatedRoute,
              private router: Router,
              private dateUtilsService: DateUtilsService,
              private departuresService: DeparturesService,
              private dataService: DataService) { }

  ngOnInit() {
    this.dateSelected = this.dataService.dateSelected || moment();

    this.dateSelectedDP = { date: { year: this.dateSelected.get('year'), month: this.dateSelected.get('month')+1, day: this.dateSelected.get('date') } };

    this.nowDayPicker = { year: this.dateSelected.get('year'), month: this.dateSelected.get('month')+1, day: this.dateSelected.get('date') };
    this.myDatePickerOptions = {
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

  gotoMixDirectionSelected() {
   this.router.navigate(['one-direction', this.dataService.directionSelected, this.dateSelected.format('DD-MM-YYYY')]);
  }

}
