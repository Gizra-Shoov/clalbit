'use strict';

var shoovWebdrivercss = require('shoov-webdrivercss');

// This can be executed by passing the environment argument like this:
// PROVIDER_PREFIX=browserstack SELECTED_CAPS=chrome mocha
// PROVIDER_PREFIX=browserstack SELECTED_CAPS=ie11 mocha
// PROVIDER_PREFIX=browserstack SELECTED_CAPS=iphone5 mocha

var capsConfig = {
  'chrome': {
    'browser' : 'Chrome',
    'browser_version' : '42.0',
    'os' : 'OS X',
    'os_version' : 'Yosemite',
    'resolution' : '1024x768'
  },
  'ie11': {
    'browser' : 'IE',
    'browser_version' : '11.0',
    'os' : 'Windows',
    'os_version' : '7',
    'resolution' : '1024x768'
  },
  'iphone5': {
    'browser' : 'Chrome',
    'browser_version' : '42.0',
    'os' : 'OS X',
    'os_version' : 'Yosemite',
    'chromeOptions': {
      'mobileEmulation': {
        'deviceName': 'Apple iPhone 5'
      }
    }
  }
};

var selectedCaps = process.env.SELECTED_CAPS || undefined;
var caps = selectedCaps ? capsConfig[selectedCaps] : undefined;

var providerPrefix = process.env.PROVIDER_PREFIX ? process.env.PROVIDER_PREFIX + '-' : '';
var testName = selectedCaps ? providerPrefix + selectedCaps : providerPrefix + 'default';

var baseUrl = process.env.BASE_URL ? process.env.BASE_URL : 'https://www.clalbit.co.il/Pages/default.aspx';

var resultsCallback = process.env.DEBUG ? console.log : shoovWebdrivercss.processResults;

describe('Visual monitor testing', function() {

  this.timeout(99999999);
  var client = {};

  before(function(done){
    client = shoovWebdrivercss.before(done, caps);
  });

  after(function(done) {
    shoovWebdrivercss.after(done);
  });

  it('should show the home page',function(done) {
    client
      .url(baseUrl)
      .execute(function() {
        jQuery('#ctl00_SPWebPartManager1_g_bfef8587_9235_4e95_a96f_e19d2c257c0d_ctl01_banner  .banner').attr('src', 'https://cloud.githubusercontent.com/assets/5812423/12536714/b8f99e68-c2b5-11e5-978e-968251842dcc.jpg')
      })
      .webdrivercss(testName + '.homepage', {
        name: '1',
        exclude:
          [
            // Video.
            '#ctl00_SPWebPartManager1_g_befc5f62_8652_4640_a506_12470a34b7c7_ctl01_banner',
          ],
        remove:
          [
            // Feedback.
            '#nanoRepProxyContainer'
          ],
        hide:
          [
            // News.
            '.wideCarousel',
            '#ctl00_SPWebPartManager1_g_3a97898a_7084_4d34_b3dc_58094e3e15d8_ctl01_m_divButtons > div > div > div > div > div > div > div.BtnMiddle > table > tbody > tr > td > a'
          ],
        screenWidth: selectedCaps == 'chrome' ? [1200] : undefined,
      }, resultsCallback)
      .call(done);
  });
});
