import {Resolve} from '@angular/Router';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';

import {DataService} from './data.service';
import { Response } from '@angular/http';



@Injectable()
export class BankHolidayListResolver implements Resolve<Response> {

  constructor(private dataService: DataService) {}

  resolve(): Observable<Response> | Promise<Response> | Response {
    return this.dataService.getCCPOIS_BankHolidays(406);
  }

}
