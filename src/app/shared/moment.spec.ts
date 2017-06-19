import * as moment from 'moment';

describe('momentjs lib testing', ()=> {

  it('should get 0 when setting Sunday', ()=> {
      const momentDate = moment().day("Sunday");   //Next Sunday
      expect(momentDate.day()).toBe(0);
  });

  it('should get 6 when setting Saturday', ()=> {
      const momentDate = moment().day("Saturday");   //Next Saturday
      expect(momentDate.day()).toBe(6);
  });

  it('should get 5 when setting Friday', ()=> {
      const momentDate = moment().day("Friday");   //Next Friday
      expect(momentDate.day()).toBe(5);
  });

  it('should get Janauary when setting month to zero', ()=> {
      const momentDate = moment().month(0);  
      expect(momentDate.month()).toBe(0);
  });

});
