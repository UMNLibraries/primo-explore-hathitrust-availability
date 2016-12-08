describe('hathiTrustAvailabilityController', function(){

  beforeEach(module('viewCustom'));
  var $componentController, $rootScope, $q, hathiTrust, ctrl, parentCtrl, expectedIds, bindings;

  beforeEach(inject(function(_$componentController_, _$rootScope_, _hathiTrust_, $injector){
    $componentController = _$componentController_;
    $rootScope = _$rootScope_;
    hathiTrust = _hathiTrust_;
    $timeout = $injector.get('$timeout');
    $q = $injector.get('$q');
    expectedIds = ["oclc:1586310", "oclc:7417753", "oclc:47076528"];
    parentCtrl = {};
    parentCtrl.result = getJSONFixture('print_result.json');
    bindings = {hathiTrust: hathiTrust, 
                parent: {parentCtrl: parentCtrl}};

  }));

  it('should pass the OCLC numbers to the hathiTrust service', function(){
    spyOn(hathiTrust, 'findFullViewRecord').and.
      returnValue({then: function(callback){ return callback(true)}});
    ctrl = $componentController('hathiTrustAvailability', null, bindings);
    ctrl.$onInit();
    expect(hathiTrust.findFullViewRecord).toHaveBeenCalledWith(expectedIds);
  });

  it('should update the hathiTrustFullText link if available', function(){
    var link = "http://example.com";
    spyOn(hathiTrust, 'findFullViewRecord').and.
      returnValue({then: function(callback){ return callback(link)}});
    ctrl = $componentController('hathiTrustAvailability', null, bindings);
    ctrl.$onInit();
    expect(ctrl.fullTextLink).toBe(link);
  });

  it('should not call the hathTrust service for online resoureces when disabled', function(){
    parentCtrl.result = getJSONFixture('online_result.json');
    spyOn(hathiTrust, 'findFullViewRecord').and.
      returnValue({then: function(callback){ return callback(true)}});

    bindings.hideOnline = true;

    ctrl = $componentController('hathiTrustAvailability', null, bindings);
    ctrl.$onInit();
    expect(hathiTrust.findFullViewRecord).not.toHaveBeenCalled();
   });

  it('should not call the hathTrust service for online resoureces by default', function(){
    parentCtrl.result = getJSONFixture('online_result.json');
    spyOn(hathiTrust, 'findFullViewRecord').and.
      returnValue({then: function(callback){ return callback(true)}});
    ctrl = $componentController('hathiTrustAvailability', null, bindings);
    ctrl.$onInit();
    expect(hathiTrust.findFullViewRecord).toHaveBeenCalled();
   });

});
