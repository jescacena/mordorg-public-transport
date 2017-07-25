import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Rx';

@Injectable()
export class CacheService {

  lineCacheList = [];

  addLineDataToCache(lineData , lineKey) {
    this.lineCacheList[lineKey] = lineData;    
  }
  removeLineDataFromCache(lineKey) {
    delete this.lineCacheList[lineKey];
  }


}
