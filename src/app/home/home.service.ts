import {Observable} from 'rxjs/Rx';
import { Injectable } from '@angular/core';

import { DataService } from '../shared/data.service';
import { DateUtilsService } from '../shared/date-utils.service';

@Injectable()
export class HomeService {


  constructor(private dataService: DataService,
              private DateUtilsService: DateUtilsService) {}


  /**
  * Get all lines data from CCPOIS in wordpress
  * @return {object} Array: 0-tren c2 , 1-bus684
  */
  getAllLinesData() {
    return Observable.forkJoin(
      this.dataService.getCCPOIS_TrainLinePubtra('c2'),
      this.dataService.getCCPOIS_BusLinePubtra('684')
      // this.dataService.getCCPOIS_TrainTimetable('c2'),
      // this.dataService.getCCPOIS_BusTimetable('684')
    );
  }
}
