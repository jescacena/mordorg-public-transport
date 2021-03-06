import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { Departure } from '../model/departure.class';
import { DataService } from './data.service';
import { BankHoliday } from '../model/bankHoliday.class';
import { DirectionsEnum } from '../model/directions.enum';

import { Response } from '@angular/http';
import * as _ from "lodash";
import { TransportTypeEnum } from '../model/transport-type.enum';

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
    let auxDate = (momentDate)? _.cloneDeep(momentDate) : moment();
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

    if(nowDay === 6) {
      return 'S';
    } else if(nowDay === 0) {
      return 'D';
    } else {
      return 'LV';
    }
    //
    // return (nowDay === 6 || nowDay === 0)? 'SD':'LV';
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
  * Get next nightly departures from momentDate in a list of departures
  * @param {object} momentDate
  * @param {object} departures Array of departures
  * @param {number} count number of next departures / null for ALL
  * @return {object} Departure
  */
  getNextNightlyDepartures(momentDate , departures: Array<Departure>, count) {
    let result: Array<Departure> = this.getNextDepartures(momentDate,departures,40);
    result = _.filter(result, (departure)=> {
      return departure && departure.isNightly;
    });

    let result2: Array<Departure> = [];

    if(count) {
      for (let i = 0; i < count ; i++) {
          result2.push(result[i]);
      }
    } else {
      result2 = result;
    }

    return result2;

  }

  /**
  * Get next departures from momentDate in a list of departures
  * @param {object} momentDate
  * @param {object} departures Array of departures
  * @param {number} count number of next departures / null for ALL
  * @return {object} Departure
  */
  getNextDepartures(momentDate , departures: Array<Departure>, count): Array<Departure> {
    let result: Array<Departure> = [];
    for (let i = 0; i < departures.length; i++) {
      if(departures[i].momentDate.isAfter(momentDate)) {
        result.push(departures[i]);
        if(count) {
          for (let j = 1; j < count; j++) {
            if(departures[i+j]) {
              result.push(departures[i+j]);
            }
          }
        } else {
          for (let j = 1; j < departures.length; j++) {
            if(departures[i+j]) {
              result.push(departures[i+j]);
            }
          }
        }
        break;
      }
    }
    //Sort ascending
    // result.sort(function(a, b) {
    //   return (a.momentDate.isAfter(b.momentDate))? 1 : -1;
    // });

    return result;
  }

  /**
  * parseTrainTimeTableByDate : for the date and the date after
  * @param data {object} json response
  * "horario_salidas_cercedilla_madrid": [
  *   "LV-5-30,45",
  *   "LV-6-00,15,30,45D",
  *   "LV-7-00,15D,30,45D",
  * @param direction {string} 'C2A' / 'A2C'
  * @param momentDate {object} moment data
  * @return {object} Array of departures
  */
  parseTrainTimeTableByDate(jsonData , direction, momentDate): Array<Departure> {
    const departures = this.parseCCPOI_TrainTimetableResponseToArray(jsonData,direction,momentDate);
    const momentDateAfter = _.cloneDeep(momentDate).add(1,'days');
    const departuresDayAfter = this.parseCCPOI_TrainTimetableResponseToArray(jsonData,direction,momentDateAfter);

    return departures.concat(departuresDayAfter);

  }
  /**
  * parseBusTimeTableByDate : for the date and the date after
  * @param data {object} json response
  * "horario_salidas_cercedilla_madrid": [
  *   "LV-5-30,45",
  *   "LV-6-00,15,30,45D",
  *   "LV-7-00,15D,30,45D",
  * @param direction {string} 'C2M' / 'M2C' / 'C2P' / 'P2C'
  * @param momentDate {object} moment data
  * @return {object} Array of departures
  */
  parseBusTimeTableByDate(jsonData , direction, momentDate): Array<Departure> {
    const departures = this.parseCCPOI_BusTimetableResponseToArray(jsonData,direction,momentDate);
    let momentDateAfter;
    let departuresDayAfter;

    //Retrieve departures for tomorrow only in specific directions
    if(
      direction !== 'P2C' &&
      direction !== 'C2P' &&
      direction !== 'H2C' &&
      direction !== 'C2H'
    ) {
      momentDateAfter = _.cloneDeep(momentDate).add(1,'days');
      departuresDayAfter = this.parseCCPOI_BusTimetableResponseToArray(jsonData,direction,momentDateAfter);
      return departures.concat(departuresDayAfter);
    } else {
      return departures;
    }
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
    let ttData:Array<string>;

    switch(direction) {
      case 'C2M':
          ttData = data.horario_salidas_cercedilla_madrid;
          break;
      case 'C2P':
          ttData = data.horario_salidas_cercedilla_berceas;
          break;
      case 'M2C':
          ttData = data.horario_salidas_madrid_cercedilla;
          break;
      case 'P2C':
          ttData = data.horario_salidas_berceas_cercedilla;
          break;
      case 'I2H':
          ttData = data.horario_salidas_instituto_hospital;
          break;
      case 'H2I':
          ttData = data.horario_salidas_hospital_instituto;
          break;
      case 'C2H':
          ttData = data.horario_salidas_cercedilla_hospital_villalba;
          break;
      case 'H2C':
          ttData = data.horario_salidas_hospital_villalba_cercedilla;
          break;
      default:
          console.log('parseCCPOI_BusTimetableResponseToArray ERROR');
    }


    return this.parseTimetableEntryArrayToDepartures(ttData , momentDate, TransportTypeEnum.Train);
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
  parseCCPOI_TrainTimetableResponseToArray(data, direction, momentDate): Array<Departure> {
    let ttData:Array<string>;

    switch(direction) {
      case 'C2A':
          ttData = data.horario_salidas_cercedilla_atocha;
          break;
      case 'C2T':
          ttData = data.horario_salidas_cercedilla_cotos;
          break;
      case 'C2S':
          ttData = data.horario_salidas_cercedilla_segovia;
          break;
      case 'A2C':
          ttData = data.horario_salidas_atocha_cercedilla;
          break;
      case 'T2C':
          ttData = data.horario_salidas_cotos_cercedilla;
          break;
      case 'S2C':
          ttData = data.horario_salidas_segovia_cercedilla;
          break;
      default:
          console.log('parseCCPOI_TrainTimetableResponseToArray ERROR');
    }

    return this.parseTimetableEntryArrayToDepartures(ttData , momentDate, TransportTypeEnum.Bus);
  }


  /**
    Parse a timetable entry array to an array of Departures
    @param ttEntryArray {object} Timetable entry array
    [
       "LV-5-30,45",
       "LV-6-00,15,30,45D",
       "LV-7-00,15D,30,45D",
    @param momentDate {object} moment data
    @param transportType {number} transport type
    @return {object} Array of departures
  */
  parseTimetableEntryArrayToDepartures(ttEntryArray,
    momentDate,
    transportType): Array<Departure> {
    let result:Array<Departure>  = [];
    let dayTypeOfTheWeek:string = 'LV';
    let dayOfTheWeek;
    let isBankHoliday;
    let isDayBeforeBankHoliday;

    const momentAux = momentDate || moment();
    const momentNew =_.cloneDeep(momentAux);
    const momentNewTomorrow =_.cloneDeep(momentAux).add(1,'days');
    const momentNewYesterday =_.cloneDeep(momentAux).subtract(1,'days');

    // console.log('JES parseCCPOI_BusTimetableResponseToArray -->momentNew', momentNew.format('DD-MM-YYYY'));
    // console.log('JES parseCCPOI_BusTimetableResponseToArray -->momentNewTomorrow', momentNewTomorrow.format('DD-MM-YYYY'));

    //Loop over items and push Departures to result array
    //LV-7-00,15D,30,45D
    dayTypeOfTheWeek = this.getDayTypeOfTheWeek(momentNew);
    isBankHoliday = this.isBankHoliday(momentNew);
    dayOfTheWeek = this.getDayOfTheWeek(momentNew);

    // console.log('JES parseCCPOI_BusTimetableResponseToArray -->dayOfTheWeek', dayOfTheWeek);
    // console.log('JES parseCCPOI_BusTimetableResponseToArray -->dayTypeOfTheWeek', dayTypeOfTheWeek);

    for (let TTEntry of ttEntryArray) {
        // console.log(TTEntry); // 1, "string", false
        const tokens = TTEntry.split('-');
        const departureType = tokens[0];
        let includeTTEntry = false;

        switch(departureType) {
          case 'LV': {
            //set day flags

            if(dayTypeOfTheWeek === 'LV' && !isBankHoliday) {
              includeTTEntry = true;
            }
            break;
          }
          case 'SDF': {
            if(dayTypeOfTheWeek === 'S' || dayTypeOfTheWeek === 'D' || isBankHoliday) {
              includeTTEntry = true;
            }
            break;
          }
          case 'S': {
            if(dayOfTheWeek === 6) {
              includeTTEntry = true;
            }
            break;
          }

          case 'NVSG': {
            //set day flags
            // console.log('Nocturno!!!!!');
            if(dayOfTheWeek === 5 || dayOfTheWeek === 6 || dayOfTheWeek === 0 ||isDayBeforeBankHoliday) {   //Viernes , Sábado, Domingo(madrugada) o Víspera de festivo
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
          // console.log('JES jander tokens-->', tokens);
          const tokens2 = tokens[2].split(',');
          //00,15D,30,45D
          for (let entry2 of tokens2) {
            const isDirect = entry2.indexOf('D') !== -1;
            const isCabezuela = entry2.indexOf('C') !== -1;
            const isNightly = (departureType === 'NVSG');
            let minute = (isDirect || isCabezuela)? entry2.slice(0, -1) : entry2;
            // console.log('JES jander minute-->', parseInt(minute));

            //Para los nocturnos ponemos el dia de mañana si hora actual < 23.59
            let momentNew2359 = _.cloneDeep(momentNew);
            momentNew2359.set('hour',23);
            momentNew2359.set('minute',59);
            let momentNew0000 = _.cloneDeep(momentNew);
            momentNew0000.set('hour',0);
            momentNew0000.set('minute',0);
            let momentNew0630 = _.cloneDeep(momentNew);
            momentNew0630.set('hour',6);
            momentNew0630.set('minute',30);

            let momentToAdd;

             if(departureType === 'NVSG' && momentNew.isBetween(momentNew0630,momentNew2359)) {
               momentToAdd = _.cloneDeep(momentNewTomorrow);
             } else if(departureType === 'NVSG' && momentNew.isBetween(momentNew0000,momentNew0630)) {
               //ponemos el día de hoy si la hora actual esta entre 00:00 y 06:30
               momentToAdd = _.cloneDeep(momentNew);
             } else {
               momentToAdd = _.cloneDeep(momentNew);
             }

            momentToAdd.set('hour', hour);
            momentToAdd.set('minute', parseInt(minute));
            // console.log('JES momentToAdd-->', momentToAdd.format("dddd, MMMM Do YYYY, h:mm:ss a"));


            //TODO set place and placeLink
            let departure = new Departure(momentToAdd,'','',departureType,isDirect,isNightly,transportType);
            departure.isCabezuela = isCabezuela;
            departure.transportTypeLabel = this._getTransportTypeLabel(transportType);
            result.push(departure);
          }
        }
    }

    if(result) {
      //Sort ascending
      result.sort(function(a, b) {
        return (a.momentDate.isAfter(b.momentDate))? 1 : -1;
      });
      // console.log('JES buildMixDepaturesFromMoment result',result);
    }

    return result;
  }

  _getTransportTypeLabel(transportType: number) {
    switch(transportType) {
      case TransportTypeEnum.Bus:
        return 'Bus';
      case TransportTypeEnum.Train:
        return 'Tren';
      default:
        return null;
    }
  }


}
