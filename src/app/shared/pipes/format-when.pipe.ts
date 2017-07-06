import {Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
import * as _ from "lodash";



@Pipe({
  name: 'formatWhen'
})
export class FormatWhenPipe implements PipeTransform{
  transform(momentDate: any) {

    let result:string;

    const nowMoment  = moment();
    const momentTomorrow = moment().add(1, 'days');

    const dateDiffInMinutes = momentDate.diff(nowMoment,'minutes');
    // console.log('JES FormatWhenPipe nowMoment momentTomorrow momentDate',nowMoment.format('DD-MM-YYYY'),momentTomorrow.format('DD-MM-YYYY'),momentDate.format('DD-MM-YYYY'));
    let dayType = (momentDate.isSame(momentTomorrow, 'day'))?  'Mañana a las ' : '';
    dayType = (momentDate.isSame(nowMoment, 'day'))?  'Hoy a las ' : dayType;
    const hour = momentDate.hour();
    const minute = momentDate.minute();
    result = dayType + _.padStart(hour,2,'0') + ':' + _.padStart(minute,2,'0');

    if(dateDiffInMinutes >0 && dateDiffInMinutes < 30) {
      result = (dateDiffInMinutes === 0)? result + " (saliendo...)" : result + " <span class='en'>(en " + dateDiffInMinutes + " minutos)</span>";
    }

    return result;

  }
}
