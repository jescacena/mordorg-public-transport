
import {TransportTypeEnum} from './transport-type.enum';
/**
*/
export class Station {

  name: string;
  address: string;
  latlon: string;
  imageUrl: string;
  gsvLink: string;
  direction: string;

  constructor(name: string,
              address: string,
              latlon: string,
              imageUrl: string,
              gsvLink: string,
              direction: string) {
    this.name = name;
    this.address = address;
    this.latlon = latlon;
    this.imageUrl = imageUrl;
    this.gsvLink = gsvLink;
    this.direction = direction;
  }

  toString(): string {
    // ...
    return null;
  }
}
