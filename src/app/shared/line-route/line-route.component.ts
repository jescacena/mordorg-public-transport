import { Component, OnInit, Input } from '@angular/core';
import {Station} from '../model/station.class';
import { DataService } from '../services/data.service';


@Component({
  selector: 'app-line-route',
  templateUrl: './line-route.component.html',
  styleUrls: ['./line-route.component.scss']
})
export class LineRouteComponent implements OnInit {

  @Input() stations: Array<Station>;
  @Input() stationSelected: Station;

  constructor(private dataService: DataService) { }

  ngOnInit() {
  }

  selectStation(station) {
    console.log('JES selectStation' , station);
    this.stationSelected = station;
    this.dataService.selectedStation.next(station);
  }

}
