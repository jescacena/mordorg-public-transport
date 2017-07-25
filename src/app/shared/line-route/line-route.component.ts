import { Component, OnInit, Input } from '@angular/core';
import {Station} from '../model/station.class';

@Component({
  selector: 'app-line-route',
  templateUrl: './line-route.component.html',
  styleUrls: ['./line-route.component.scss']
})
export class LineRouteComponent implements OnInit {

  @Input() stations: Array<Station>;
  @Input() stationSelected: string;

  constructor() { }

  ngOnInit() {
  }

}
