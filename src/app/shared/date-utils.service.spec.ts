// import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import * as moment from 'moment';
import * as _ from "lodash";

import { DateUtilsService } from './date-utils.service';
import { Departure } from '../model/departure.class';

// import { DataService } from './data.service';


describe('DateUtilsService', () => {

  const dateUtilsService = new DateUtilsService();
  //Set some list of bank holidays
  dateUtilsService.setBankHolydays("01/01/2017#Año_nuevo,06/01/2017#Epifanía_del_Señor");

  const jsonResponse = {
    "horario_salidas_cercedilla_madrid": [
      "LV-5-30,45",
      "LV-6-00,15,30,45D",
      "LV-7-00,15D,30,45D",
      "SDF-6-25",
      "SDF-7-30",
      "SDF-8-30",
      "NVSG-2-15",
      "NVSG-5-20"
    ]
  };

  beforeEach(() => {

  });

  it('should parse bus valid timetable for Friday from response', () => {
    const momentDateFriday = moment().day("Friday");   //Load next Friday

    const result = dateUtilsService.parseCCPOI_BusTimetableResponseToArray(jsonResponse,'C2M',momentDateFriday);

    // for(let item of result) {
    //   console.log('JES janderrrr item.momentDate-->',item.momentDate.format('DD/MM/YYYY HH:mm'));
    // }

    expect(result).not.toBeNull();
    expect(result.length).toBe(12);
  });

  it('should parse bus valid timetable for Monday from response', () => {
    const momentDateMonday = moment().day("Monday");   //Load a Monday

    const result = dateUtilsService.parseCCPOI_BusTimetableResponseToArray(jsonResponse,'C2M',momentDateMonday);
    expect(result).not.toBeNull();
    expect(result.length).toBe(10);
  });

  it('should parse bus valid timetable for Saturday from response', () => {
    const momentDateSaturday = moment().day(6);   //next Saturday

    const result = dateUtilsService.parseCCPOI_BusTimetableResponseToArray(jsonResponse,'C2M',momentDateSaturday);
    expect(result).not.toBeNull();
    expect(result.length).toBe(5);
  });

  it('should contains SDF entries for a bank holiday from response', () => {
    const momentDateBankHoliday = moment().date(6).month(0);   // día de los reyes magos

    const result = dateUtilsService.parseCCPOI_BusTimetableResponseToArray(jsonResponse,'C2M',momentDateBankHoliday);

    const sdfEntries:Array<Departure> = _.filter(result , (departure)=> {
      return departure.departureType === 'SDF';
    });

    // for(let item of result) {
    //   console.log('JES new departure-->',item.momentDate.format('DD/MM/YYYY HH:mm'));
    //   console.log('JES departureType-->',item.departureType);
    // }

    expect(result).not.toBeNull();
    expect(sdfEntries.length).toBe(3);
  });

  it('should contains NVSG entries for a day before a bank holiday', () => {
    const momentDateBankHoliday = moment().date(5).month(0);   // día ANTES de los reyes magos

    const result = dateUtilsService.parseCCPOI_BusTimetableResponseToArray(jsonResponse,'C2M',momentDateBankHoliday);

    const sdfEntries:Array<Departure> = _.filter(result , (departure)=> {
      return departure.departureType === 'NVSG';
    });

    expect(result).not.toBeNull();
    expect(sdfEntries.length).toBe(2);
  });

  it('getDayTypeOfTheWeek should get "SD" for Sunday', () => {
    const momentDate = moment().day("Sunday");
    expect(dateUtilsService.getDayTypeOfTheWeek(momentDate)).toEqual('SD');
  });
  //
  it('getDayTypeOfTheWeek should get "SD" for Saturday', () => {
    const momentDate = moment().day("Saturday");
    expect(dateUtilsService.getDayTypeOfTheWeek(momentDate)).toEqual('SD');
  });


  it('isBankHoliday should get true for Bank holiday', () => {
    const momentDate = moment();
    momentDate.set('date',1);
    momentDate.set('month',0);
    momentDate.set('year',2017);
    // console.log('JES isBankHoliday-->',momentDate.format('DD/MM/YYYY HH:mm'));

    expect(dateUtilsService.isBankHoliday(momentDate)).toBe(true);
  });

  it('getDayTypeOfTheWeek should get "LV" for Monday', () => {
    const momentDate = moment().day("Monday");
    expect(dateUtilsService.getDayTypeOfTheWeek(momentDate)).toEqual('LV');
  });

});
