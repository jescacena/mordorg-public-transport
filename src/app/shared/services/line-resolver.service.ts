import {Resolve,ActivatedRouteSnapshot} from '@angular/Router';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import { Response } from '@angular/http';
import {ActivatedRoute, Data, Params} from '@angular/router';


import {DataService} from './data.service';
import {CacheService} from './cache.service';
import {Line} from '../model/line.class';



@Injectable()
export class LineResolver implements Resolve<Response> {

  constructor(private dataService: DataService,private cacheService: CacheService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Response> | Promise<Response> | Response {
    const lineId = route.params['lineid'];
    const transportType = parseInt(route.params['transporttype']);
    // debugger;
    if(this.cacheService.lineCacheList[lineId]) {
      return this.cacheService.lineCacheList[lineId];
    } else {
      return this.dataService.getLineData(lineId, transportType);
    }
  }

}
