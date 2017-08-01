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
import { DirectionLabels } from '../shared/model/direction-labels.constant';



@Component({
  selector: 'app-transport-detail',
  templateUrl: './transport-detail.component.html',
  styleUrls: ['./transport-detail.component.scss']
})
export class TransportDetailComponent implements OnInit {
  line:Line;
  lineId:string;
  direction:number;
  stations:Array<Station>;
  lineReponse: Response;
  lineResponseObj;
  lineName:string;
  directionLabel:string;
  stationSelectedId:string;
  stationSelected:Station;
  durationEstimated:string;

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
    this.stationSelectedId = this.route.snapshot.params['stationid'];

    //TODO get station selected

    //Resolve line data
    this.route.data.subscribe(
       (data: Data) => {
        // console.log(data['lineReponse']);
         if(data['lineReponse'].headers) {
           this.lineResponseObj = data['lineReponse'].json()[0];
         } else {
           this.lineResponseObj = data['lineReponse'];
         }
       }
    );


    //Get cached data
    // const cachedData = this.cacheService.lineCacheList[this.lineId];

    console.log('JES TransportDetailComponent lineResponseObj',this.lineResponseObj);

    //Build title label
    this.lineName = this.lineResponseObj.nombre;
    this.directionLabel = DirectionLabels[this.direction];


    //Build stations list
    const stationsData = (this.direction === DirectionsEnum.CercedillaMadrid)? this.lineResponseObj['stations-cercedilla-madrid'][0]:this.lineResponseObj['stations-madrid-cercedilla'][0];
    this.durationEstimated = (this.direction === DirectionsEnum.CercedillaMadrid)? this.lineResponseObj['stations-cercedilla-madrid'][0].duration_estimated:this.lineResponseObj['stations-madrid-cercedilla'][0].duration_estimated;

    console.log('JES TransportDetailComponent stationsData',stationsData);

    let stationList: Array<Station> = [];

    //Station start
    let stationStartData;
    let auxKey;
    for (let key of Object.keys(stationsData.station_start)) {
      stationStartData = stationsData.station_start[key];
      auxKey = key+'';
    }
    stationList.push(new Station(auxKey,
                                  stationStartData.nombre,
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
        auxKey = key+'';

      }
      if(stationIndexData) {
        stationList.push(new Station(auxKey,
                                      stationIndexData.nombre,
                                      stationIndexData.direccion,
                                      stationIndexData.latlon,
                                      stationIndexData.image_front.guid,
                                      stationIndexData.google_streetview_link,
                                      stationIndexData.sentido
                                    ));
      }

    }

    //Station end
    let stationEndData;
    for (let key of Object.keys(stationsData.station_end)) {
      stationEndData = stationsData.station_end[key];
      auxKey = key+'';

    }

    stationList.push(new Station(auxKey,
                                  stationEndData.nombre,
                                  stationEndData.direccion,
                                  stationEndData.latlon,
                                  stationEndData.image_front.guid,
                                  stationEndData.google_streetview_link,
                                  stationEndData.sentido
                                ));


    this.stations = stationList;

    //Hack remove
    this.stationSelected = this.stations[0];
    this.stationSelected = this.stations.filter((item:Station)=> {
        return item.id ===  this.stationSelectedId;
    })[0];


    console.log('JES TransportDetailComponent stationList',stationList);


    this.line = new Line(this.lineId,stationList);
  }

}
