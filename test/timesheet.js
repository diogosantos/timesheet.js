/**
 * Load Timesheet lib and fake a window object …
 */
window = {};
require(__dirname + '/../source/javascripts/timesheet.js');

var assert = require('assert');
suite('Timesheet', function() {
  test('Calculation', function(done) {
    var TS = new window.Timesheet();

    assert.equal(29,  (TS.createBubble(60, new Date(2012, 0, 1), new Date(2012, 0, 1), new Date(2012, 0, 30))).getDays());

    done();
  });
});
