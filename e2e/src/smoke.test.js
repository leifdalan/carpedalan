const pw = require('puppeteer');

describe('snapshots', () => {
  let browser;
  let page;
  beforeAll(async () => {
    browser = await pw.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    }); // or 'chromium', 'firefox'
    page = await browser.newPage();
    page.setViewport({ width: 960, height: 1200, deviceScaleFactor: 2 });
  });
  afterAll(async () => {
    await browser.close();
  });

  it('renders correctly', async () => {
    await page.goto('http://local.carpedalan.com/');
    await page.waitForSelector('[data-test="password"]');

    const image = await page.screenshot();

    expect(image).toMatchImageSnapshot();
  });
  // await page.focus('[data-test="password"]');
  // await page.keyboard.type('asdf');
  // await page.keyboard.press('Enter');
  // await page.waitForSelector(
  //   '[src="https://photos.local.carpedalan.com/web/xmas-768.jpg"]',
  // );
  // let something;
  // await page.$eval(() => {
  //   something = document.querySelector('.scroller');
  //   console.error('something1', something);

  //   something.scrollBy(0, window.innerHeight);
  // }); for
  // console.error('something2', something);

  // await page.screenshot({ path: 'example.png' });

  // console.timeEnd('run');
});
