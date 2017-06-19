import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { Departure } from '../model/departure.class';
import { DataService } from './data.service';
import { BankHoliday } from '../model/bankHoliday.class';
import { Response } from '@angular/http';
import * as _ from "lodash";

@Injectable()
export class DateUtilsService {

  // constructor(private dataService: DataService) {}
  private bhArray:Array<BankHoliday> = [];

  /**
    setBankHolydays
    @param commaArray {string} "01/01/2017#Año_nuevo,06/01/2017#Epifanía_del_Señor,..."
  */
  setBankHolydays(commaArray) {
    const tokens = commaArray.split(',');
    for(let item of tokens) {
      const tokens2 = item.split('#');
      let momentDate = moment();
      const tokens3 = tokens2[0].split('/');
      momentDate.set('year',parseInt(tokens3[2]));
      momentDate.set('month',parseInt(tokens3[1])-1);
      momentDate.set('date',parseInt(tokens3[0]));
      const aux = new BankHoliday(momentDate,tokens2[1]);
      this.bhArray.push(aux);

    }

    // console.log(this.bhArray);

    // for (let i = 0; i < this.bhArray.length; i++) {
    //     console.log('BH-item moment-->',this.bhArray[i].momentDate.format('DD/MM/YYYY'),this.bhArray[i].label);
    // }

  }




  /**
    Get if it is a previous day for a bank holiday
    @param {object} momentDate
    @return {boolean} return true when is the day before to a bank holiday
  */
  isDayBeforeBankHoliday(momentDate) {
    let auxDate = (momentDate)? momentDate : moment();
    auxDate.add(1, 'days');
    return this.isBankHoliday(auxDate);
  }

  /**
    Get Day of the week
    @return {number} 0-Sunday ... 6-Saturday
  */
  getDayOfTheWeek(momentDate) {
    return (momentDate)? momentDate.day() : moment().day();
  }


  /**
    Get Day Type of the week
    * NOTE Saturday = 6 and Sunday = 0
    @return {string} 'LV' when is Monday-Friday / 'SD' when is Saturday - Sunday
  */
  getDayTypeOfTheWeek(momentDate) {
    momentDate = momentDate || moment();
    const nowDay = momentDate.day();
    // console.log('nowDay-->',nowDay);

    return (nowDay === 6 || nowDay === 0)? 'SD':'LV';
  }


  /**
    Get true when day is bank holiday
    @param {object} moment date
    @return {string} true / false
  */
  isBankHoliday(momentDate) {
    momentDate = momentDate || moment();
    let isBankHoliday = false;
    for(let bh of this.bhArray) {
      const date = bh.momentDate.get('date');
      const month = bh.momentDate.get('month');
      const year = bh.momentDate.get('year');
      if(date === momentDate.get('date') && month === momentDate.get('month') && year === momentDate.get('year')) {
        isBankHoliday = true;
      }
    }
    return isBankHoliday;
  }


  /**
    Parse a CCPOI timetable response to an array of Departures
    @param data {object} json response
    "horario_salidas_cercedilla_madrid": [
       "LV-5-30,45",
       "LV-6-00,15,30,45D",
       "LV-7-00,15D,30,45D",
    @param direction {string} 'C2M' / 'M2C'
    @param momentDate {object} moment data
    @return {object} Array of departures
  */
  parseCCPOI_BusTimetableResponseToArray(data, direction, momentDate): Array<Departure> {
    let result:Array<Departure>  = [];
    let ttData:Array<string>;
    let dayTypeOfTheWeek:string = 'LV';
    let dayOfTheWeek;
    let isBankHoliday;
    let isDayBeforeBankHoliday;

    const momentAux = momentDate || moment();
    switch(direction) {
      case 'C2M':
          ttData = data.horario_salidas_cercedilla_madrid;
          break;
      case 'M2C':
          ttData = data.horario_salidas_madrid_cercedilla;
          break;
      default:
          console.log('parseCCPOI_TrainTimetableResponseToArray ERROR');
    }
    //get day type of the week (LV/SDF)
    dayTypeOfTheWeek = this.getDayTypeOfTheWeek(momentAux);
    isBankHoliday = this.isBankHoliday(momentAux);
    dayOfTheWeek = this.getDayOfTheWeek(momentAux);
    isDayBeforeBankHoliday = this.isDayBeforeBankHoliday(momentAux);
    // console.log('JES parseCCPOI_BusTimetableResponseToArray-->', momentAux.format('DD-MM-YYYY'),dayTypeOfTheWeek,dayOfTheWeek,isDayBeforeBankHoliday);

    //Loop over items and push Departures to result array
    //LV-7-00,15D,30,45D
    for (let TTEntry of ttData) {
        // console.log(entry); // 1, "string", false
        // let momentNew = Object.assign({},momentAux || moment());
        const tokens = TTEntry.split('-');
        const departureType = tokens[0];
        let includeTTEntry = false;

        switch(departureType) {
          case 'LV': {
            if(dayTypeOfTheWeek === 'LV') {
              includeTTEntry = true;
            }
            break;
          }
          case 'SDF': {
            if(dayTypeOfTheWeek === 'SD' || isBankHoliday) {
              includeTTEntry = true;
            }
            break;
          }
          case 'NVSG': {
            if(dayOfTheWeek === 5 || dayOfTheWeek === 6 || isDayBeforeBankHoliday) {
              includeTTEntry = true;
            }
            break;
          }

          default: {
            includeTTEntry = false;
          }

        }

        if(includeTTEntry) {
          const hour = parseInt(tokens[1]);
          // console.log('JES jander hour-->', hour);
          const tokens2 = tokens[2].split(',');
          //00,15D,30,45D
          for (let entry2 of tokens2) {
            const isDirect = entry2.indexOf('D') !== -1;
            let minute = (entry2.indexOf('D') !== -1)? entry2.slice(0, -1) : entry2;
            // console.log('JES jander minute-->', parseInt(minute));

            let momentNew =_.cloneDeep(momentAux);

            //Para los nocturnos ponemos el dia de mañana
            momentNew = (tokens[0] === 'NVSG')? momentNew.add(1,'days') : momentNew;
            momentNew.set('hour', hour);
            momentNew.set('minute', parseInt(minute));

            let departure = new Departure(momentNew,'','',departureType,isDirect);

            result.push(departure);
          }
        }
    }

    return result;
  }

}
