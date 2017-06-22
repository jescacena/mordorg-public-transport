import {Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
import * as _ from "lodash";



@Pipe({
  name: 'formatWhen'
})
export class FormatWhenPipe implements PipeTransform{
  transform(momentDate: any) {

    let result:string;

    const dateDiff = momentDate.diff(moment(),'minutes');
    // console.log('JES janderrrr dateDiff',dateDiff);
    const dayType = (momentDate.get('date') === moment().get('date'))? '': 'Mañana a las ';
    const hour = momentDate.hour();
    const minute = momentDate.minute();
    result = dayType + _.padStart(hour,2,'0') + ':' + _.padEnd(minute,2,'0');

    if(dateDiff < 30) {
      result = (dateDiff === 0)? result + " (saliendo...)" : result + " (en " + dateDiff + " minutos)";
    }

    return result;

  }
}
