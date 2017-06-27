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

  const jsonCCOISBusResponse = {
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

  const jsonCCOISTrainResponse = {
    "horario_salidas_cercedilla_atocha": [
      "LV-18-35",
      "LV-19-03,33",
      "LV-20-04,34",
      "LV-21-35",
      "LV-22-35",
      "SDF-6-29",
      "SDF-7-34",
      "SDF-8-34",
      "SDF-9-34",
      "SDF-10-35"
    ]
  };

  beforeEach(() => {

  });


  describe('TRAIN timetable tests', () => {
    it('should parse train valid timetable for Monday from response', () => {
      const momentDate = moment().day("Monday");   //Load a Monday

      const result = dateUtilsService.parseCCPOI_TrainTimetableResponseToArray(jsonCCOISTrainResponse,'C2A',momentDate);

      expect(result).not.toBeNull();
      expect(result.length).toBe(7);
    });
    it('should parse train valid timetable for Saturday from response', () => {
      const momentDate = moment().day("Saturday");   //Load a Monday

      const result = dateUtilsService.parseCCPOI_TrainTimetableResponseToArray(jsonCCOISTrainResponse,'C2A',momentDate);

      expect(result).not.toBeNull();
      expect(result.length).toBe(5);
    });
    it('should get next departure at 19:33 for moment 19:20 on Friday', ()=> {
      const momentDate = moment().day("Friday");
      momentDate.set('hour',19);
      momentDate.set('minute',20);

      const departures = dateUtilsService.parseTrainTimeTableByDate(jsonCCOISTrainResponse,'C2A',momentDate);

      const result = dateUtilsService.getNextDepartures(momentDate, departures, 1);

      expect(result).not.toBeNull();
      expect(result.length).toBe(1);
      expect(result[0].momentDate.get('hour')).toBe(19);
      expect(result[0].momentDate.get('minute')).toBe(33);
    });
    it('should get next departure at 08:00 for moment 08:34 on Saturday', ()=> {
      const momentDate = moment().day("Saturday");
      momentDate.set('hour',8);
      momentDate.set('minute',0);

      const departures = dateUtilsService.parseTrainTimeTableByDate(jsonCCOISTrainResponse,'C2A',momentDate);

      const result = dateUtilsService.getNextDepartures(momentDate, departures, 1);

      expect(result).not.toBeNull();
      expect(result.length).toBe(1);
      expect(result[0].momentDate.get('hour')).toBe(8);
      expect(result[0].momentDate.get('minute')).toBe(34);
    });

  });

  describe('BUS timetable tests', () => {
    it('should get 20 departures for Monday', ()=> {
      const momentDateMonday = moment().day("Monday");   //Load a Monday
      const result = dateUtilsService.parseBusTimeTableByDate(jsonCCOISBusResponse,'C2M',momentDateMonday);

      // for(let item of result) {
      //   console.log('JES janderrrr-->',item.momentDate.format('DD/MM/YYYY HH:mm'));
      // }

      expect(result).not.toBeNull();
      expect(result.length).toBe(20);

    });

    it('should get next 2 valid departures for moment 8:50 (over last ttentry of the day) on Monday', ()=> {

      const momentDate = moment().day("Monday");   //Load next Friday
      momentDate.set('hour',8);
      momentDate.set('minute',50);
      const momentDateDayAfter = _.cloneDeep(momentDate).add(1,'days');

      const departures = dateUtilsService.parseBusTimeTableByDate(jsonCCOISBusResponse,'C2M',momentDate);
      // for(let item of departures) {
      //   console.log('JES departures-->',item.momentDate.format('DD/MM/YYYY HH:mm'));
      // }
      const result = dateUtilsService.getNextDepartures(momentDate, departures, 2);
      // for(let item of result) {
      //   console.log('JES nextdep-->',item.momentDate.format('DD/MM/YYYY HH:mm'));
      // }

      expect(result).not.toBeNull();
      expect(result.length).toBe(2);
      expect(result[0].momentDate.get('date')).toBe(momentDateDayAfter.get('date'));
      expect(result[1].momentDate.get('date')).toBe(momentDateDayAfter.get('date'));
    });

    it('should get next 2 valid departures for moment 5:50 on Monday', ()=> {
      const momentDate = moment().day("Monday");   //Load next Friday
      momentDate.set('hour',5);
      momentDate.set('minute',50);

      const departures = dateUtilsService.parseBusTimeTableByDate(jsonCCOISBusResponse,'C2M',momentDate);
      const result = dateUtilsService.getNextDepartures(momentDate, departures, 2);

      expect(result).not.toBeNull();
      expect(result.length).toBe(2);

      expect(result[0].momentDate.get('hour')).toBe(6);
      expect(result[0].momentDate.get('minute')).toBe(0);

      expect(result[1].momentDate.get('hour')).toBe(6);
      expect(result[1].momentDate.get('minute')).toBe(15);


    });

    it('should get next departure at 2:15 (nighty) for moment 23:50 on Friday', ()=> {
      const momentDateFriday = moment().day("Friday");   //Load next Friday
      momentDateFriday.set('hour',23);
      momentDateFriday.set('minute',50);
      // console.log('JES janderrrr momentDateFriday-->',momentDateFriday.format('DD/MM/YYYY HH:mm'));

      const departures = dateUtilsService.parseBusTimeTableByDate(jsonCCOISBusResponse,'C2M',momentDateFriday);

      const result = dateUtilsService.getNextDepartures(momentDateFriday, departures, 1);

      //console.log('JES janderrrr result-->',result[0].momentDate.format('DD/MM/YYYY HH:mm'));

      // for(let item of departures) {
      //   console.log('JES janderrrr nighty-->',item.momentDate.format('DD/MM/YYYY HH:mm'));
      // }

      expect(result).not.toBeNull();
      expect(result.length).toBe(1);
      expect(result[0].momentDate.day()).toBe(6);
      expect(result[0].momentDate.get('hour')).toBe(2);
      expect(result[0].momentDate.get('minute')).toBe(15);
    });

    it('should get next departure at 6:00 for moment 5:50 on Friday', ()=> {
      const momentDateFriday = moment().day("Friday");   //Load next Friday
      momentDateFriday.set('hour',5);
      momentDateFriday.set('minute',50);

      const departures = dateUtilsService.parseBusTimeTableByDate(jsonCCOISBusResponse,'C2M',momentDateFriday);

      const result = dateUtilsService.getNextDepartures(momentDateFriday, departures, 1);

      expect(result).not.toBeNull();
      expect(result.length).toBe(1);
      expect(result[0].momentDate.get('hour')).toBe(6);
      expect(result[0].momentDate.get('minute')).toBe(0);
    });

    it('should get next 2 nightly departures for moment 15:50 on Friday', ()=> {
      const momentDateFriday = moment().day("Friday");   //Load next Friday
      momentDateFriday.set('hour',15);
      momentDateFriday.set('minute',50);

      const departures = dateUtilsService.parseBusTimeTableByDate(jsonCCOISBusResponse,'C2M',momentDateFriday);

      const result = dateUtilsService.getNextNightlyDepartures(momentDateFriday, departures, 2);

      expect(result).not.toBeNull();
      expect(result.length).toBe(2);
      expect(result[0].momentDate.get('hour')).toBe(2);
      expect(result[0].momentDate.get('minute')).toBe(15);

      expect(result[1].momentDate.get('hour')).toBe(5);
      expect(result[1].momentDate.get('minute')).toBe(20);
    });

    it('should get next departure at 8:30 for moment 8:10 on Saturday', ()=> {
      const momentDate = moment().day("Saturday");
      momentDate.set('hour',8);
      momentDate.set('minute',10);

      const departures = dateUtilsService.parseBusTimeTableByDate(jsonCCOISBusResponse,'C2M',momentDate);

      // for(let item of departures) {
      //   console.log('JES new departure-->',item.departureType,item.momentDate.format('DD/MM/YYYY HH:mm'));
      // }

      const result = dateUtilsService.getNextDepartures(momentDate, departures, 1);

      expect(result).not.toBeNull();
      expect(result.length).toBe(1);
      expect(result[0].momentDate.get('hour')).toBe(8);
      expect(result[0].momentDate.get('minute')).toBe(30);
    });

    it('should parse bus valid timetable for Friday from response', () => {
      const momentDateFriday = moment().day("Friday");   //Load next Friday

      const result = dateUtilsService.parseCCPOI_BusTimetableResponseToArray(jsonCCOISBusResponse,'C2M',momentDateFriday);

      // for(let item of result) {
      //   console.log('JES new departure-->',item.departureType,item.momentDate.format('DD/MM/YYYY HH:mm'));
      // }

      expect(result).not.toBeNull();
      expect(result.length).toBe(12);
    });

    it('should parse bus valid timetable for Monday from response', () => {
      const momentDateMonday = moment().day("Monday");   //Load a Monday

      const result = dateUtilsService.parseCCPOI_BusTimetableResponseToArray(jsonCCOISBusResponse,'C2M',momentDateMonday);

      // for(let item of result) {
      //   console.log('JES new departure-->',item.departureType,item.momentDate.format('DD/MM/YYYY HH:mm'));
      // }


      expect(result).not.toBeNull();
      expect(result.length).toBe(10);
    });

    it('should parse bus valid timetable for Saturday from response', () => {
      const momentDateSaturday = moment().day(6);   //next Saturday

      const result = dateUtilsService.parseCCPOI_BusTimetableResponseToArray(jsonCCOISBusResponse,'C2M',momentDateSaturday);

      // for(let item of result) {
      //   console.log('JES new departure-->',item.departureType,item.momentDate.format('DD/MM/YYYY HH:mm'));
      // }

      // expect(result).not.toBeNull();
      // expect(result.length).toBe(5);
    });

    it('should contains SDF entries for a bank holiday from response', () => {
      const momentDateBankHoliday = moment().date(6).month(0);   // día de los reyes magos

      const result = dateUtilsService.parseCCPOI_BusTimetableResponseToArray(jsonCCOISBusResponse,'C2M',momentDateBankHoliday);

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

      const result = dateUtilsService.parseCCPOI_BusTimetableResponseToArray(jsonCCOISBusResponse,'C2M',momentDateBankHoliday);

        // for(let item of result) {
        //   console.log('JES new departure-->',item.momentDate.format('DD/MM/YYYY HH:mm'));
        //   console.log('JES departureType-->',item.departureType);
        // }

      const sdfEntries:Array<Departure> = _.filter(result , (departure)=> {
        return departure.departureType === 'NVSG';
      });

      expect(result).not.toBeNull();
      expect(sdfEntries.length).toBe(2);
    });

  });


  it('getDayTypeOfTheWeek should get "SD" for Sunday', () => {
    const momentDate = moment().day("Sunday");
    expect(dateUtilsService.getDayTypeOfTheWeek(momentDate)).toEqual('SD');
  });
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
