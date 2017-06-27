import {Observable} from 'rxjs/Rx';
import { Injectable } from '@angular/core';

import { DataService } from '../shared/data.service';
import { DateUtilsService } from '../shared/date-utils.service';

@Injectable()
export class HomeService {


  constructor(private dataService: DataService,
              private DateUtilsService: DateUtilsService) {}


}
