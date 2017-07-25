import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Data, Params} from '@angular/router';

import { DateUtilsService } from '../shared/services/date-utils.service';
import { DeparturesService } from '../shared/services/departures.service';
import { DataService } from '../shared/services/data.service';
import { CacheService } from '../shared/services/cache.service';
import { Departure } from '../shared/model/departure.class';
import { DirectionsEnum } from '../shared/model/directions.enum';
import { Line } from '../shared/model/line.class';
import { Station } from '../shared/model/station.class';


@Component({
  selector: 'app-transport-detail',
  templateUrl: './transport-detail.component.html',
  styleUrls: ['./transport-detail.component.css']
})
export class TransportDetailComponent implements OnInit {
  line:Line;
  lineId:string;
  direction:number;
  stations:Array<Station>;
  lineReponse: Response;

  constructor(private route:ActivatedRoute,
              private dateUtilsService: DateUtilsService,
              private departuresService: DeparturesService,
              private dataService: DataService,
              private cacheService: CacheService
            ) { }



  ngOnInit() {

    //Fetch data from cache service
    this.lineId = this.route.snapshot.params['lineid'];
    this.direction = parseInt(this.route.snapshot.params['direction']);

    //Resolve bank holidays and init dateUtilsService
    this.route.data.subscribe(
       (data: Data) => {
        // console.log(data['lineReponse']);
         if(data['lineReponse'].headers) {
           this.lineReponse = data['lineReponse'].json()[0];
         } else {
           this.lineReponse = data['lineReponse'];
         }
       }
    );


    //Get cached data
    // const cachedData = this.cacheService.lineCacheList[this.lineId];

    console.log('JES TransportDetailComponent lineReponse',this.lineReponse);

    //Build stations list
    const stationsData = (this.direction === DirectionsEnum.CercedillaMadrid)? this.lineReponse['stations-cercedilla-madrid'][0]:this.lineReponse['stations-madrid-cercedilla'][0];

    console.log('JES TransportDetailComponent stationsData',stationsData);

    let stationList: Array<Station> = [];

    //Station start
    let stationStartData;
    for (let key of Object.keys(stationsData.station_start)) {
      stationStartData = stationsData.station_start[key];
    }
    stationList.push(new Station(stationStartData.nombre,
                                  stationStartData.direccion,
                                  stationStartData.latlon,
                                  stationStartData.image_front.guid,
                                  stationStartData.google_streetview_link,
                                  stationStartData.sentido
                                ));

    //Rest of stations
    for (let i = 1; i <= 3; i++) {
      let stationIndexData;
      for (let key of Object.keys(stationsData['station_'+i])) {
        stationIndexData = stationsData['station_'+i][key];
      }
      stationList.push(new Station(stationIndexData.nombre,
                                    stationIndexData.direccion,
                                    stationIndexData.latlon,
                                    stationIndexData.image_front.guid,
                                    stationIndexData.google_streetview_link,
                                    stationIndexData.sentido
                                  ));

    }

    //Station end
    let stationEndData;
    for (let key of Object.keys(stationsData.station_end)) {
      stationEndData = stationsData.station_end[key];
    }

    stationList.push(new Station(stationEndData.nombre,
                                  stationEndData.direccion,
                                  stationEndData.latlon,
                                  stationEndData.image_front.guid,
                                  stationEndData.google_streetview_link,
                                  stationEndData.sentido
                                ));


    this.stations = stationList;

    console.log('JES TransportDetailComponent stationList',stationList);


    this.line = new Line(this.lineId,stationList);
  }

}
