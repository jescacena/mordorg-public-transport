import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Rx';
import { Ng2DeviceService } from 'ng2-device-detector';

import {TransportTypeEnum} from '../model/transport-type.enum';
import {DirectionsEnum} from '../model/directions.enum';
import { DeviceTypeEnum } from '../../shared/model/device-type.enum';



@Injectable()
export class DataService {

  mixDeparturesCerceMadrid = new Subject();
  mixDeparturesMadridCerce = new Subject();
  mixDepartures = new Subject();

  //When user click on a station on a line route
  selectedStation = new Subject();

  //When user change direction on home direction selector
  newDirectionSelected = new Subject();

  //When user change date selected on home date picker
  newDateSelected = new Subject();

  //Toggle nav menu
  toggleNavMenu = new Subject();

  //Close nav menu
  closeNavMenu = new Subject();

  //Show fullscreen spinner
  showPageTransitionSpinner = new Subject();

  //Hide fullscreen spinner
  hidePageTransitionSpinner = new Subject();

  directionSelected:number = DirectionsEnum.CercedillaMadrid;
  dateSelected:Object;

  constructor(private http: Http, private deviceService: Ng2DeviceService) {}

  getDetails() {
    const resultPromise = new Promise((resolve,reject)=>{
      setTimeout(()=> {
        resolve('Data');
      },1500);
    });
    return resultPromise;
  }



  /**
  * Get line data from CCPOIS in wordpress
  * @param {string} lineId
  * @param {number} transportType
  * @return {object}
  */
  getLineData(lineId:string ,tranportType:number) {
    // return getAllLinesData();
    // return this.getCCPOIS_BusLinePubtra(lineId);

    //Clean line id
    lineId = lineId.replace('line-pubtra-','');
    switch(tranportType) {
      case TransportTypeEnum.Bus:
        return this.getCCPOIS_BusLinePubtra(lineId);
      case TransportTypeEnum.Train:
        return this.getCCPOIS_TrainLinePubtra(lineId);

      default:
        return null;
    }

  }

  /**
  * Get bus line data
  * @param {string} busId
  */
  getBusLineData(busId:string) {
    return this.getCCPOIS_BusLinePubtra(busId);
  }

  /**
  * Get train line data
  * @param {string} busId
  */
  getTrainLineData(trainId:string) {
    return this.getCCPOIS_TrainLinePubtra(trainId);
  }

  /**
  * Get all lines data from CCPOIS in wordpress
  * @return {object} Array: 0-tren c2 , 1-bus684
  */
  getAllLinesData() {
    return Observable.forkJoin(
      this.getCCPOIS_TrainLinePubtra('c2'),
      this.getCCPOIS_TrainLinePubtra('c9'),
      this.getCCPOIS_BusLinePubtra('684'),
      this.getCCPOIS_BusLinePubtra('piscinas')
      // this.dataService.getCCPOIS_TrainTimetable('c2'),
      // this.dataService.getCCPOIS_BusTimetable('684')
    );
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

  getDeviceType() {

    const userAgent = this.deviceService.getDeviceInfo().userAgent;
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent) ) {
      return DeviceTypeEnum.MobileHandset;
    } else {
      return DeviceTypeEnum.Desktop;
    }

  }

}
