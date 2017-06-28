import { Injectable } from '@angular/core';
import { Departure } from '../model/departure.class';
import { DateUtilsService } from './date-utils.service';
import { DirectionsEnum } from '../model/directions.enum';



@Injectable()
export class DeparturesService {

  constructor(private dateUtilsService: DateUtilsService) { }

  /**
  * Build an array of departures for both types: train and busses
  * @param {object} momentDate
  * @param {string} directionSelected directionSelected
  * @param {object} trainTT train timetable
  * @param {object} busTT bus timetable
  * @param {object} cercedillaBusStation cercedillaStation
  * @param {object} targetBusStation targetStation
  * @param {object} cercedillaTrainStation cercedillaStation
  * @param {object} targetTrainStation targetStation
  * @param {number} count number of departures to be retrieved (dividible by 2)  ---> null for ALL
  * @return {object} Array of Departure
  */
  buildMixDepaturesFromMoment(momentDate,
                              directionSelected ,
                              trainTT ,
                              busTT ,
                              cercedillaBusStation ,
                              targetBusStation,
                              cercedillaTrainStation ,
                              targetTrainStation,
                              count:number = null) {
    let result: Array<Departure>;
    let trainNextDeparts: Array<Departure>;
    let busNextDeparts: Array<Departure>;


    const countLocalByType = (!count || count%2 !== 0)? null : count/2;

    switch(directionSelected) {
      case DirectionsEnum.CercedillaMadrid:
        //Train
        const trainTodayDeparturesC2A = this.dateUtilsService.parseTrainTimeTableByDate(trainTT,'C2A',momentDate);
        trainNextDeparts = this.dateUtilsService.getNextDepartures(momentDate,
                                                                  trainTodayDeparturesC2A,
                                                                  countLocalByType);
        //Bus 684
        const busTodayDeparturesC2M = this.dateUtilsService.parseBusTimeTableByDate(busTT,'C2M',momentDate);
        busNextDeparts = this.dateUtilsService.getNextDepartures(momentDate, busTodayDeparturesC2M, countLocalByType);

        //Set place station start
        for(let depart of busNextDeparts) {
          depart.placeLabel = cercedillaBusStation.direccion;
          depart.placeLink = "http://maps.google.com/?q=" + cercedillaBusStation.latlon;
        }
        for(let depart of trainNextDeparts) {
          depart.placeLabel = cercedillaTrainStation.direccion;
          depart.placeLink = "http://maps.google.com/?q=" + cercedillaTrainStation.latlon;
        }

        //Concat train and bus in mixed
        result = busNextDeparts.concat(trainNextDeparts);
        break;

      case DirectionsEnum.MadridCercedilla:
        const trainTodayDeparturesA2C = this.dateUtilsService.parseTrainTimeTableByDate(trainTT,'A2C',momentDate);
        trainNextDeparts = this.dateUtilsService.getNextDepartures(momentDate, trainTodayDeparturesA2C, countLocalByType);

        const busTodayDeparturesM2C = this.dateUtilsService.parseBusTimeTableByDate(busTT,'M2C',momentDate);
        busNextDeparts = this.dateUtilsService.getNextDepartures(momentDate, busTodayDeparturesM2C, countLocalByType);

        //Set place station start
        for(let depart of busNextDeparts) {
          depart.placeLabel = targetBusStation.direccion;
          depart.placeLink = "http://maps.google.com/?q="+targetBusStation.latlon;
        }
        //Set place station start
        for(let depart of trainNextDeparts) {
          depart.placeLabel = targetTrainStation.direccion;
          depart.placeLink = "http://maps.google.com/?q=" + targetTrainStation.latlon;
        }

        //Concat train and bus in mixed
        result = busNextDeparts.concat(trainNextDeparts);
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

    return result;



  }


}
