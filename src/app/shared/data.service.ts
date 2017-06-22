import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import {Subject} from 'rxjs/Subject';


@Injectable()
export class DataService {

  mixDeparturesCerceMadrid = new Subject();
  mixDeparturesMadridCerce = new Subject();
  mixDepartures = new Subject();

  //When user change direction on home direction selector
  newDirectionSelected = new Subject();

  constructor(private http: Http) {}

  getDetails() {
    const resultPromise = new Promise((resolve,reject)=>{
      setTimeout(()=> {
        resolve('Data');
      },1500);
    });
    return resultPromise;
  }


  // http://jesidea.com/cercepois/wp-json/wp/v2/bank_holidays/406
  getCCPOIS_BankHolidays(calendarId){
    return this.http.get('http://jesidea.com/cercepois/wp-json/wp/v2/bank_holidays/'+calendarId);
  }


  // http://jesidea.com/cercepois/wp-json/wp/v2/timepubtra-684
  // http://jesidea.com/cercepois/wp-json/wp/v2/timepubtra-1
  getCCPOIS_BusTimetable(busId) {
    return this.http.get('http://jesidea.com/cercepois/wp-json/wp/v2/timepubtra-'+busId);
  }

  //http://jesidea.com/cercepois/wp-json/wp/v2/timepubtra-train-c2
  getCCPOIS_TrainTimetable(trainId) {
    return this.http.get('http://jesidea.com/cercepois/wp-json/wp/v2/timepubtra-train-'+trainId);
  }

  //http://jesidea.com/cercepois/wp-json/wp/v2/line-pubtra-c2
  getCCPOIS_TrainLinePubtra(trainId) {
    return this.http.get('http://jesidea.com/cercepois/wp-json/wp/v2/line-pubtra-'+trainId);
  }

  //http://jesidea.com/cercepois/wp-json/wp/v2/line-pubtra-c2
  getCCPOIS_BusLinePubtra(busId) {
    return this.http.get('http://jesidea.com/cercepois/wp-json/wp/v2/line-pubtra-'+busId);
  }

}
