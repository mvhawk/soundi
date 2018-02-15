import { Soundic.UiPage } from './app.po';

describe('soundic.ui App', () => {
  let page: Soundic.UiPage;

  beforeEach(() => {
    page = new Soundic.UiPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
