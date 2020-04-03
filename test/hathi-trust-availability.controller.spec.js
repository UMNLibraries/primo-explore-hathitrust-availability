describe("hathiTrustAvailabilityController", function() {
  beforeEach(module("hathiTrustAvailability"));
  var $componentController,
    $rootScope,
    $q,
    hathiTrust,
    ctrl,
    prmSearchResultAvailabilityLine,
    expectedIds,
    bindings;
  var myIconSrc = "my/icon/file.svg";
  beforeEach(function() {
    module(function($provide) {
      $provide.value("hathiTrustIconPath", myIconSrc);
    });
  });

  beforeEach(inject(function(
    _$componentController_,
    _$rootScope_,
    _hathiTrust_,
    $injector
  ) {
    $componentController = _$componentController_;
    $rootScope = _$rootScope_;
    hathiTrust = _hathiTrust_;
    $timeout = $injector.get("$timeout");
    $q = $injector.get("$q");
    expectedIds = ["oclc:1586310", "oclc:7417753", "oclc:47076528"];
    prmSearchResultAvailabilityLine = {};
    prmSearchResultAvailabilityLine.result = getJSONFixture(
      "print_result.json"
    );
    bindings = {
      hathiTrust: hathiTrust,
      prmSearchResultAvailabilityLine: prmSearchResultAvailabilityLine
    };
  }));

  it("should pass the OCLC numbers to the hathiTrust service", function() {
    spyOn(hathiTrust, "findFullViewRecord").and.returnValue({
      then: function(callback) {
        return callback(true);
      }
    });
    ctrl = $componentController("hathiTrustAvailability", null, bindings);
    ctrl.$onInit();
    expect(hathiTrust.findFullViewRecord).toHaveBeenCalledWith(expectedIds);
  });

  it("should update the hathiTrustFullText link if available", function() {
    var link = "http://example.com";
    spyOn(hathiTrust, "findFullViewRecord").and.returnValue({
      then: function(callback) {
        return callback(link);
      }
    });
    ctrl = $componentController("hathiTrustAvailability", null, bindings);
    ctrl.$onInit();
    expect(ctrl.fullTextLink).toBe(link);
  });

  it("should not call the hathTrust service for online resoureces when disabled", function() {
    prmSearchResultAvailabilityLine.result = getJSONFixture(
      "online_result.json"
    );
    spyOn(hathiTrust, "findFullViewRecord").and.returnValue({
      then: function(callback) {
        return callback(true);
      }
    });

    bindings.hideOnline = true;

    ctrl = $componentController("hathiTrustAvailability", null, bindings);
    ctrl.$onInit();
    expect(hathiTrust.findFullViewRecord).not.toHaveBeenCalled();
  });

  it("should call the hathTrust service for online resoureces by default", function() {
    prmSearchResultAvailabilityLine.result = getJSONFixture(
      "online_result.json"
    );
    spyOn(hathiTrust, "findFullViewRecord").and.returnValue({
      then: function(callback) {
        return callback(true);
      }
    });
    ctrl = $componentController("hathiTrustAvailability", null, bindings);
    ctrl.$onInit();
    expect(hathiTrust.findFullViewRecord).toHaveBeenCalled();
  });

  it("should accept a custom availability message", function() {
    var myMsg = "FULL TEXT FROM HATHITRUST, YAY!";
    bindings.msg = myMsg;
    ctrl = $componentController("hathiTrustAvailability", null, bindings);
    ctrl.$onInit();
    expect(ctrl.msg).toBe(myMsg);
  });

  it("should use a default availability message when not provided", function() {
    var expectedDefaultMsg = "Full Text Available at HathiTrust";
    ctrl = $componentController("hathiTrustAvailability", null, bindings);
    ctrl.$onInit();
    expect(ctrl.msg).toBe(expectedDefaultMsg);
  });

  it("should call hathiTrust.findRecord() when ignoreCopyright=true", function() {
    prmSearchResultAvailabilityLine.result = getJSONFixture(
      "online_result.json"
    );
    spyOn(hathiTrust, "findFullViewRecord").and.returnValue({
      then: function(callback) {
        return callback(true);
      }
    });
    spyOn(hathiTrust, "findRecord").and.returnValue({
      then: function(callback) {
        return callback(true);
      }
    });

    bindings.ignoreCopyright = true;

    ctrl = $componentController("hathiTrustAvailability", null, bindings);
    ctrl.$onInit();
    expect(hathiTrust.findFullViewRecord).not.toHaveBeenCalled();
    expect(hathiTrust.findRecord).toHaveBeenCalled();
  });

  it("should append an 'signon' parameter when an entityId is defined", function() {
    var link = "http://example.com";
    var entityId = "https://example.edu/idp/shibboleth";
    spyOn(hathiTrust, "findFullViewRecord").and.returnValue({
      then: function(callback) {
        return callback(link);
      }
    });

    bindings.entityId = entityId;

    ctrl = $componentController("hathiTrustAvailability", null, bindings);
    ctrl.$onInit();
    expect(ctrl.fullTextLink).toBe(link + "?signon=swle:" + entityId);
  });
});
