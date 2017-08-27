import { Injectable } from '@angular/core';
import { Departure } from '../model/departure.class';
import { DateUtilsService } from './date-utils.service';
import { DirectionsEnum } from '../model/directions.enum';
import { TransportTypeEnum } from '../model/transport-type.enum';
import { Station } from '../model/station.class';



@Injectable()
export class DeparturesService {

  constructor(private dateUtilsService: DateUtilsService) { }

  /**
  * Build an array of departures for both types: train and busses
  * @param {object} momentDate
  * @param {string} directionSelected directionSelected
  * @param {object} trainData train line data
  * @param {object} busData bus line data
  * @param {number} count number of departures to be retrieved (dividible by 2)  ---> null for ALL
  * @return {object} Array of Departure
  */
  buildMixDepaturesFromMoment(momentDate,
                              directionSelected ,
                              trainData,
                              busData,
                              count:number = null) {
    let result: Array<Departure>;

    const countLocalByType = (!count || count%2 !== 0)? null : count;

    switch(directionSelected) {
      case DirectionsEnum.CercedillaMadrid:
        result = this.fillMixDeparturesByDirection(busData,trainData,'C2M' ,'C2A', momentDate, directionSelected,countLocalByType);
        break;

      case DirectionsEnum.MadridCercedilla:
        result = this.fillMixDeparturesByDirection(busData,trainData,'M2C' ,'A2C', momentDate, directionSelected,countLocalByType);
        break;

      case DirectionsEnum.CercedillaPiscinasBerceas:
        result = this.fillMixDeparturesByDirection(busData,null,'C2P' ,null, momentDate, directionSelected,count);
        break;

      case DirectionsEnum.CercedillaCotos:
        result = this.fillMixDeparturesByDirection(null,trainData,null ,'C2T', momentDate, directionSelected,count);
        break;

      case DirectionsEnum.PiscinasBerceasCercedilla:
        result = this.fillMixDeparturesByDirection(busData,null,'P2C' ,null, momentDate, directionSelected,count);
        break;

      case DirectionsEnum.CotosCercedilla:
        result = this.fillMixDeparturesByDirection(null,trainData,null,'T2C', momentDate, directionSelected,count);
        break;

      case DirectionsEnum.HospitalFuenfriaInstituto:
        result = this.fillMixDeparturesByDirection(busData,null,'H2I' ,null, momentDate, directionSelected,count);
        break;

      case DirectionsEnum.InstitutoHospitalFuenfria:
        result = this.fillMixDeparturesByDirection(busData,null,'I2H' ,null, momentDate, directionSelected,count);
        break;

      default:
        console.log('Direction ' + directionSelected + 'not available!');
        result = null;
        break;
    }

    if(result) {
      //Sort ascending
      result.sort(function(a, b) {
        return (a.momentDate.isAfter(b.momentDate))? 1 : -1;
      });
      // console.log('JES buildMixDepaturesFromMoment result',result);
    }

    //Trunc to count
    if(result && countLocalByType) {
      return result.slice(0, countLocalByType);
    } else {
      return result;
    }

  }


  /**
  fillMixDeparturesByDirection
  * Fill an array of departures for both types: train and busses
  * @param {object} busData bus line data
  * @param {object} trainData train line data
  * @param {string} directionBusCode directionBusCode 'C2M','M2C','C2P','P2C'
  * @param {string} directionTrainCode directionTrainCode 'C2A','A2C'
  * @param {object} momentDate
  * @param {string} directionSelected directionSelected
  * @param {number} count number of departures to be retrieved (dividible by 2)  ---> null for ALL
  * @return {object} Array of Departure
  */

  fillMixDeparturesByDirection(busData,trainData,directionBusCode ,directionTrainCode, momentDate, directionSelected,count) {
    let result: Array<Departure>;
    let trainNextDeparts: Array<Departure>;
    let busNextDeparts: Array<Departure>;

    //Get types
    let trainLineType = (trainData)? trainData.type : null;
    let busLineType = (busData)? busData.type : null;

    //Get timetables
    let trainTT = (trainData)? trainData.timetable[0] : null;
    let busTT = (busData)? busData.timetable[0] : null;

    //Get limit Stations
    let busStation;
    switch(directionBusCode) {
      case 'C2M':
        busStation = busData.station_start[0];
        break;
      case 'C2P':
        busStation = busData.station_start[0];
        break;
      case 'I2H':
        busStation = busData.station_start[0];
        break;
      case 'M2C':
        busStation = busData.station_end[0];
        break;
      case 'P2C':
        busStation = busData.station_end[0];
        break;
      case 'H2I':
        busStation = busData.station_end[0];
        break;
      default:
        break;
    }
    let trainStation;
    switch(directionTrainCode) {
      case 'C2A':
        trainStation = trainData.station_start[0];
        break;
      case 'C2T':
        trainStation = trainData.station_start[0];
        break;
      case 'A2C':
        trainStation = trainData.station_end[0];
        break;
      case 'T2C':
        trainStation = trainData.station_end[0];
        break;
      default:
        break;
    }

    //Train
    if(trainData) {
      const trainTodayDepartures= this.dateUtilsService.parseTrainTimeTableByDate(trainTT,directionTrainCode,momentDate);
      trainNextDeparts = this.dateUtilsService.getNextDepartures(momentDate,
                                                                trainTodayDepartures,
                                                                count);
      for(let depart of trainNextDeparts) {
        depart.transportType = TransportTypeEnum.Train;
        depart.direction = directionSelected;
        depart.lineType = trainLineType;
        depart.label = trainData.nombre;
        depart.placeLabel = trainStation.direccion;
        depart.station = trainStation;
        depart.placeLink = "http://maps.google.com/?q=" + trainStation.latlon;
      }

    }
    //Bus
    if(busData) {
      const busTodayDepartures = this.dateUtilsService.parseBusTimeTableByDate(busTT,directionBusCode,momentDate);
      busNextDeparts = this.dateUtilsService.getNextDepartures(momentDate, busTodayDepartures, count);
      //Set label & place station start
      for(let depart of busNextDeparts) {
        depart.transportType = TransportTypeEnum.Bus;
        depart.direction = directionSelected;
        depart.lineType = busLineType;
        depart.label = busData.nombre;
        depart.placeLabel = busStation.direccion;
        depart.station = busStation;
        depart.placeLink = "http://maps.google.com/?q=" + busStation.latlon;
      }
    }

    //Concat train and bus in mixed
    if(trainNextDeparts && busNextDeparts) {
      result = busNextDeparts.concat(trainNextDeparts);
    } else if(trainNextDeparts && !busNextDeparts) {
      result = trainNextDeparts;
    } else {
      result = busNextDeparts;
    }
    return result;

  }

}
