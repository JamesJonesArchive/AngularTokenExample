'use strict';

describe('Service: tokenjsonp', function () {

  // load the service's module
  beforeEach(module('tokenExampleApp'));

  // instantiate service
  var tokenjsonp;
  beforeEach(inject(function (_tokenjsonp_) {
    tokenjsonp = _tokenjsonp_;
  }));

  it('should do something', function () {
    expect(!!tokenjsonp).toBe(true);
  });

});
