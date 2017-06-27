import {Observable} from 'rxjs/Rx';
import { Injectable } from '@angular/core';

import { DataService } from '../../shared/services/data.service';
import { DateUtilsService } from '../../shared/services/date-utils.service';

@Injectable()
export class HomeService {


  constructor(private dataService: DataService,
              private DateUtilsService: DateUtilsService) {}


}
