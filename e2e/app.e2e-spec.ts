import { AmosTestingProjectPage } from './app.po';

describe('amos-testing-project App', () => {
  let page: AmosTestingProjectPage;

  beforeEach(() => {
    page = new AmosTestingProjectPage();
  });

  it('should display welcome message', done => {
    page.navigateTo();
    page.getParagraphText()
      .then(msg => expect(msg).toEqual('Welcome to app!!'))
      .then(done, done.fail);
  });
});
