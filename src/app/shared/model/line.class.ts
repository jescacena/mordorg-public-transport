
import {TransportTypeEnum} from './transport-type.enum';
import {Station} from './station.class';
/**
*/
export class Line {

  lineType: string;  //line-pubtra-c86
  stations: Array<Station>;  //DirectionsEnum : CercedillaMadrid / Madrid-Cercedilla

  constructor(lineType,
              stations: Array<Station>) {
    this.lineType = lineType;
    this.stations = stations;
  }

  toString(): string {
    // ...
    return null;
  }

}
