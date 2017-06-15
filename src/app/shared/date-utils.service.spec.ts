// import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import * as moment from 'moment';
import { DateUtilsService } from './date-utils.service';
// import { DataService } from './data.service';


describe('DateUtilsService', () => {

  let component: DateUtilsService;


  it('should get "SDF" for Sunday', () => {
    let dateUtilsService = new DateUtilsService();
    const momentDate = moment().day("Sunday");
    expect(dateUtilsService.getDayTypeOfTheWeek(momentDate)).toEqual('SDF');
  });


  it('should get "SDF" for Bank holiday', () => {
    let dateUtilsService = new DateUtilsService();
    dateUtilsService.setBankHolydays("01/01/2017#Año_nuevo,06/01/2017#Epifanía_del_Señor");
    const momentDate = moment();
    momentDate.set('date',1);
    momentDate.set('month',0);
    momentDate.set('year',2017);
    expect(dateUtilsService.getDayTypeOfTheWeek(momentDate)).toEqual('SDF');
  });

  it('should get "LV" for Monday', () => {
    let dateUtilsService = new DateUtilsService();
    const momentDate = moment().day("Monday");
    expect(dateUtilsService.getDayTypeOfTheWeek(momentDate)).toEqual('LV');
  });
});
