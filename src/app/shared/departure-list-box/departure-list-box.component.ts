import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/Rx';
import * as moment from 'moment';
import { Router, ActivatedRoute } from '@angular/router';
import { Ng2DeviceService } from 'ng2-device-detector';


import { DataService } from '../services/data.service';
import { Departure } from '../model/departure.class';

@Component({
  selector: 'app-departure-list-box',
  templateUrl: './departure-list-box.component.html',
  styleUrls: ['./departure-list-box.component.scss']
})
export class DepartureListBoxComponent implements OnInit {

  @Input() count: number;
  @Input() feedType: string;
  @Input() customClass: string;

  subscription: Subscription;

  departures: Array<Departure>;

  directionSelected:number;

  nowMoment= moment();

  scrollAtBottom: boolean = false;
  scrollAtTop: boolean = true;

  deviceInfo = null;


  constructor(private dataService: DataService,
              private route: ActivatedRoute,
              private router: Router,
              private deviceService: Ng2DeviceService) { }


  ngOnInit() {

    this.directionSelected = (this.dataService.directionSelected)? this.dataService.directionSelected : this.directionSelected;

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
    if(this.feedType === 'mixDepartures') {
      this.subscription = this.dataService.mixDepartures.subscribe(
        (data: Array<Departure>)=> {
          if(data) {
            this.departures = data;
          }
      });
    }

  }

  onScroll(event) {
    // console.log('JES onscroll' , event.target.scrollTop , event.target.scrollHeight);
    const target = event.target;

    this.scrollAtTop = (target.scrollTop < 1);
    this.scrollAtBottom = (target.offsetHeight + target.scrollTop == target.scrollHeight);
  }

  goTransportDetail(departureData) {
    console.log('JES departureData',departureData);
    this.router.navigate(['line-detail',departureData.transportType,departureData.lineType, departureData.direction, departureData.station.id]);
  }

}
