import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/Rx';
import * as moment from 'moment';

import { DataService } from '../shared/data.service';
import { Departure } from '../model/departure.class';

@Component({
  selector: 'app-departure-list-box',
  templateUrl: './departure-list-box.component.html',
  styleUrls: ['./departure-list-box.component.scss']
})
export class DepartureListBoxComponent implements OnInit {

  @Input() count: number;
  @Input() feedType: string;

  subscription: Subscription;

  departures: Array<Departure>;

  nowMoment= moment();

  constructor(private dataService: DataService) { }

  ngOnInit() {

    if(this.feedType === 'mixDeparturesCerceMadrid') {
      this.subscription = this.dataService.mixDeparturesCerceMadrid.subscribe(
        (data: Array<Departure>)=> {
          if(data) {
            this.departures = data;
          }
      });
    }
    if(this.feedType === 'mixDeparturesMadridCerce') {
      this.subscription = this.dataService.mixDeparturesMadridCerce.subscribe(
        (data: Array<Departure>)=> {
          if(data) {
            this.departures = data;
          }
      });
    }
  }

}
