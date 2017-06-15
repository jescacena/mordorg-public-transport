import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { Departure } from '../model/departure.class';
import { DataService } from './data.service';
import { BankHoliday } from '../model/bankHoliday.class';
import { Response } from '@angular/http';


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

    for (let i = 0; i < this.bhArray.length; i++) {
        console.log('BH-item moment-->',this.bhArray[i].momentDate.format('DD/MM/YYYY'),this.bhArray[i].label);
    }

  }




  /**
    Get Day Type of the week
    @return {string} 'LV' when is Monday-Friday / 'SFD' when is Saturday - Sunday - Bank holiday
  */
  getDayTypeOfTheWeek(momentDate) {
    const nowDay = (momentDate)? momentDate.day() : moment().day();
    let isBankHoliday = false;
    for(let bh of this.bhArray) {
      // console.log('BH-item moment-->',bh.momentDate.format('DD/MM/YYYY'));
      // console.log('momentDate-->',momentDate.format('DD/MM/YYYY'));
      if(bh.momentDate.isSame(momentDate)) {
        isBankHoliday = true;
      }
    }
    return (nowDay === 6 || nowDay === 0 || isBankHoliday)? 'SDF':'LV';
  }


  /**
    Parse a CCPOI timetable response to an array of Departures
    @param data {object} json response
    @param direction {string} 'C2M' / 'M2C'
    @return {object} Array of departures
  */
  parseCCPOI_TrainTimetableResponseToArray(data, direction): Array<Departure> {
    let result:Array<Departure>  = [];
    let ttData:Array<string>;
    let dayTypeOfTheWeek:string = 'LV';

    switch(direction) {
      case 'C2M':
          ttData = data.horario_salidas_cercedilla_madrid;

          //TODO get day type of the week (LV/SDF)

          //TODO Loop over items and push Departures to result array
          for (let entry of ttData) {
              console.log(entry); // 1, "string", false
              const tokens = entry.split('-');
              if(tokens[0]===dayTypeOfTheWeek) {

              }
          }
          break;
      case 'M2C':
          ttData = data.horario_salidas_madrid_cercedilla;
          break;
      default:
          console.log('parseCCPOI_TrainTimetableResponseToArray ERROR');
}
    result.push(new Departure(moment(),'sasdsa','qweqweqweqw'));
    result.push(new Departure(moment(),'sasdsa','qweqweqweqw'));

    return result;
  }

}
