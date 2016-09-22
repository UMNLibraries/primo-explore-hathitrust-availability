describe('hathiTrust', function() {
  var hathiTrust, $httpBackend, $timeout;

  beforeEach(angular.mock.module('viewCustom'));

  beforeEach(inject(function(_hathiTrust_, $injector) {
    $httpBackend = $injector.get('$httpBackend');
    $timeout = $injector.get('$timeout');
    hathiTrust = _hathiTrust_; 
    jasmine.getJSONFixtures().fixturesPath = 'base/test/fixtures';
  }));

  it('should return a link when full text is available', function(){
    var data = getJSONFixture('oclc3756332.json');
    var url = 'https://catalog.hathitrust.org/api/volumes/brief/json/oclc:3756332?callback=JSON_CALLBACK';
    var expectedFullTextLink = "https://catalog.hathitrust.org/Record/007158726";
    $httpBackend.expectJSONP(url).respond(data);
    hathiTrust.findFullViewRecord(["oclc:3756332"]).
      then(function(res) { expect(res).toBe(expectedFullTextLink)});
    $httpBackend.flush();
  });

  it('should not return a link when full text NOT is available', function(){
    var data = getJSONFixture('oclc343816212.json');
    var url = 'https://catalog.hathitrust.org/api/volumes/brief/json/oclc:343816212?callback=JSON_CALLBACK';
    $httpBackend.expectJSONP(url).respond(data);
    hathiTrust.findFullViewRecord(["oclc:343816212"]).then(function(res) { expect(res).toBeFalsy() });
    $httpBackend.flush();
  });

  it('should not return a link when no IDs are provided', function(){
    hathiTrust.findFullViewRecord([]).then(function(res) { expect(res).toBeFalsy() });
    $timeout.flush();
    $httpBackend.verifyNoOutstandingRequest
  });

  it('should request multiple IDs when provided', function(){
    var url = 'https://catalog.hathitrust.org/api/volumes/brief/json/oclc:1759490|oclc:19536513?callback=JSON_CALLBACK';
    $httpBackend.expectJSONP(url).respond(404, '');
    hathiTrust.findFullViewRecord(["oclc:1759490", "oclc:19536513"])
    $httpBackend.flush();
  });

  it('should return the first full view record when multiple are available', function(){
    var data = getJSONFixture('oclc1586310_oclc7417753_oclc47076528.json');
    var url = 'https://catalog.hathitrust.org/api/volumes/brief/json/oclc:1586310|oclc:7417753|oclc:47076528?callback=JSON_CALLBACK';
    var expectedFullTextLink = "https://catalog.hathitrust.org/Record/000637680";
    $httpBackend.expectJSONP(url).respond(data);
    hathiTrust.findFullViewRecord(["oclc:1586310", "oclc:7417753","oclc:47076528"]).
      then(function(res) { expect(res).toBe(expectedFullTextLink) });
    $httpBackend.flush();
  });


});
    
xdescribe('prmSearchResultAvailabilityLineAfter', function(){
  beforeEach(angular.mock.module('viewCustom'));

  var element, scope, $hathiTrust; 

  beforeEach(inject(function($rootScope, $compile){
    //TODO: set up a mock HT service
    scope = $rootScope.$new();
    scope.ctrl = {};
    scope.ctrl.result = getJSONFixture('result.json');
    element = angular.element('<prm-search-result-availability-line-after parent-ctrl="ctrl" class="ng-isolate-scope"></prm-search-result-availability-line-after>');
    element = $compile(element)(scope);
    scope.$apply();
  }));

  it('should exist', function(){
    //console.log(scope);
    console.log(scope.ctrl);

    expect(element).toBeDefined();
  });
});

describe('prmSearchResultAvailabilityLineAfterController', function(){
  beforeEach(module('viewCustom'));
  var $componentController, $rootScope, $q, hathiTrust, ctrl, parentCtrl, expectedIds;

  beforeEach(inject(function(_$componentController_, _$rootScope_, _hathiTrust_, $injector){
    $componentController = _$componentController_;
    $rootScope = _$rootScope_;
    hathiTrust = _hathiTrust_;
    $timeout = $injector.get('$timeout');
    $q = $injector.get('$q');
    expectedIds = ["oclc:1586310", "oclc:7417753", "oclc:47076528"];
    parentCtrl = {};
    parentCtrl.result = getJSONFixture('result.json');
  }));

  it('should pass the OCLC numbers to the hathiTrust service', function(){
    spyOn(hathiTrust, 'findFullViewRecord').and.
      returnValue({then: function(callback){ return callback(true)}});
    ctrl = $componentController('prmSearchResultAvailabilityLineAfter', null, 
        {parentCtrl: parentCtrl, hathiTrust: hathiTrust});
    expect(hathiTrust.findFullViewRecord).toHaveBeenCalledWith(expectedIds);
  });

  it('should update the hathiTrustFullText link if available', function(){
    var link = "http://example.com";
    spyOn(hathiTrust, 'findFullViewRecord').and.
      returnValue({then: function(callback){ return callback(link)}});
    ctrl = $componentController('prmSearchResultAvailabilityLineAfter', null, 
        {parentCtrl: parentCtrl, hathiTrust: hathiTrust});
    expect(ctrl.hathiTrustFullText).toBe(link);
  });

  xit('should not call the hathTrust service for online journals', function(){
   spyOn(hathiTrust, 'findFullViewRecord').and.
      returnValue({then: function(callback){ return callback(true)}});
    ctrl = $componentController('prmSearchResultAvailabilityLineAfter', null, 
        {parentCtrl: parentCtrl, hathiTrust: hathiTrust});

    expect(hathiTrust.findFullViewRecord).not.toHaveBeenCalled();
   });


});


  
      

