describe("hathiTrustAvailabilityController", function () {
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
  beforeEach(function () {
    module(function ($provide) {
      $provide.value("hathiTrustIconPath", myIconSrc);
    });
  });

  beforeEach(inject(function ($injector) {
    $componentController = $injector.get("$componentController");
    $rootScope = $injector.get("$rootScope");
    hathiTrust = $injector.get("hathiTrust");
    $timeout = $injector.get("$timeout");
    $q = $injector.get("$q");
    expectedIds = ["oclc:1586310", "oclc:7417753", "oclc:47076528"];
    prmSearchResultAvailabilityLine = {};
    prmSearchResultAvailabilityLine.result = getJSONFixture(
      "print_result.json"
    );
    bindings = {
      hathiTrust: hathiTrust,
      prmSearchResultAvailabilityLine: prmSearchResultAvailabilityLine,
    };
  }));

  it("should pass the OCLC numbers to the hathiTrust service", function () {
    spyOn(hathiTrust, "findFullViewRecord").and.returnValue({
      then: function (callback) {
        return callback(true);
      },
    });
    ctrl = $componentController("hathiTrustAvailability", null, bindings);
    ctrl.$onInit();
    expect(hathiTrust.findFullViewRecord).toHaveBeenCalledWith(expectedIds);
  });

  // VE fails to remove the 035 (ocolc) prefix in its addata normalization rules
  it("should handle Primo VE's poorly-formatted OCLC numbers", function () {
    prmSearchResultAvailabilityLine.result = getJSONFixture(
      "ve_print_result.json"
    );
    expectedIds = ["oclc:1185554", "oclc:316173611", "oclc:794832420"];
    spyOn(hathiTrust, "findFullViewRecord").and.returnValue({
      then: function (callback) {
        return callback(true);
      },
    });
    ctrl = $componentController("hathiTrustAvailability", null, bindings);
    ctrl.$onInit();
    expect(hathiTrust.findFullViewRecord).toHaveBeenCalledWith(expectedIds);
  });

  /**
   * It looks like VE normalization rules copy non-OCLC numbers from the 035 into addata/oclcid.
   * In cases where the 035 field does not have a prefix, it we treat it as if it were an OCLC ID.
   */
  it("should handle spurious OCLC numbers", function () {
    prmSearchResultAvailabilityLine.result = getJSONFixture(
      "ve_result_with_invalid_oclcids.json"
    );
    expectedIds = ["oclc:286433636", "oclc:5634943"];
    spyOn(hathiTrust, "findFullViewRecord").and.returnValue({
      then: function (callback) {
        return callback(true);
      },
    });
    ctrl = $componentController("hathiTrustAvailability", null, bindings);
    ctrl.$onInit();
    expect(hathiTrust.findFullViewRecord).toHaveBeenCalledWith(expectedIds);
  });

  

  it("should update the hathiTrustFullText link if available", function () {
    var link = "http://example.com";
    spyOn(hathiTrust, "findFullViewRecord").and.returnValue({
      then: function (callback) {
        return callback(link);
      },
    });
    ctrl = $componentController("hathiTrustAvailability", null, bindings);
    ctrl.$onInit();
    expect(ctrl.fullTextLink).toBe(link);
  });

  it("should call the hathTrust service for online resoureces by default", function () {
    prmSearchResultAvailabilityLine.result = getJSONFixture(
      "online_result.json"
    );
    spyOn(hathiTrust, "findFullViewRecord").and.returnValue({
      then: function (callback) {
        return callback(true);
      },
    });
    ctrl = $componentController("hathiTrustAvailability", null, bindings);
    ctrl.$onInit();
    expect(hathiTrust.findFullViewRecord).toHaveBeenCalled();
  });

  // adding this case to ensure that VE's unique delivery section is handled properly
  it("should not call the hathiTrust service for online resources when disabled", function () {
    prmSearchResultAvailabilityLine.result = getJSONFixture(
      "ve_online_result.json"
    );
    spyOn(hathiTrust, "findFullViewRecord").and.returnValue({
      then: function (callback) {
        return callback(true);
      },
    });

    bindings.hideOnline = true;

    ctrl = $componentController("hathiTrustAvailability", null, bindings);
    ctrl.$onInit();
    expect(hathiTrust.findFullViewRecord).not.toHaveBeenCalled();
  });

  it("should not call the hathiTrust service for online resources when disabled", function () {
    prmSearchResultAvailabilityLine.result = getJSONFixture(
      "online_result.json"
    );
    spyOn(hathiTrust, "findFullViewRecord").and.returnValue({
      then: function (callback) {
        return callback(true);
      },
    });

    bindings.hideOnline = true;

    ctrl = $componentController("hathiTrustAvailability", null, bindings);
    ctrl.$onInit();
    expect(hathiTrust.findFullViewRecord).not.toHaveBeenCalled();
  });

  it("should call the hathiTrust service for non-journals, when 'hide-if-journal'", function () {
    // set conditions such that 'hide-if-journal' is true BUT the item format is not a journal
    prmSearchResultAvailabilityLine.result = getJSONFixture(
      "online_result.json"
    );
    prmSearchResultAvailabilityLine.result.pnx.addata.format[0] = "book";
    bindings.hideIfJournal = true;

    spyOn(hathiTrust, "findFullViewRecord").and.returnValue({
      then: function (callback) {
        return callback(true);
      },
    });

    ctrl = $componentController("hathiTrustAvailability", null, bindings);
    ctrl.$onInit();
    expect(hathiTrust.findFullViewRecord).toHaveBeenCalled();
  });

  it("should not call the hathiTrust service for journals when 'hide-if-journal'", function () {
    // set conditions such that 'hide-if-journal' is true AND the item format is a journal
    prmSearchResultAvailabilityLine.result = getJSONFixture(
      "online_result.json"
    );
    prmSearchResultAvailabilityLine.result.pnx.addata.format[0] = "journal";
    bindings.hideIfJournal = true;

    spyOn(hathiTrust, "findFullViewRecord").and.returnValue({
      then: function (callback) {
        return callback(true);
      },
    });

    ctrl = $componentController("hathiTrustAvailability", null, bindings);
    ctrl.$onInit();
    expect(hathiTrust.findFullViewRecord).not.toHaveBeenCalled();
  });

  it("should accept a custom availability message", function () {
    var myMsg = "FULL TEXT FROM HATHITRUST, YAY!";
    bindings.msg = myMsg;
    ctrl = $componentController("hathiTrustAvailability", null, bindings);
    ctrl.$onInit();
    expect(ctrl.msg).toBe(myMsg);
  });

  it("should use a default availability message when not provided", function () {
    var expectedDefaultMsg = "Full Text Available at HathiTrust";
    ctrl = $componentController("hathiTrustAvailability", null, bindings);
    ctrl.$onInit();
    expect(ctrl.msg).toBe(expectedDefaultMsg);
  });

  it("should call hathiTrust.findRecord() when ignoreCopyright=true", function () {
    prmSearchResultAvailabilityLine.result = getJSONFixture(
      "online_result.json"
    );
    spyOn(hathiTrust, "findFullViewRecord").and.returnValue({
      then: function (callback) {
        return callback(true);
      },
    });
    spyOn(hathiTrust, "findRecord").and.returnValue({
      then: function (callback) {
        return callback(true);
      },
    });

    bindings.ignoreCopyright = true;

    ctrl = $componentController("hathiTrustAvailability", null, bindings);
    ctrl.$onInit();
    expect(hathiTrust.findFullViewRecord).not.toHaveBeenCalled();
    expect(hathiTrust.findRecord).toHaveBeenCalled();
  });

  it("should append an 'signon' parameter when an entityId is defined", function () {
    var link = "http://example.com";
    var entityId = "https://example.edu/idp/shibboleth";
    spyOn(hathiTrust, "findFullViewRecord").and.returnValue({
      then: function (callback) {
        return callback(link);
      },
    });

    bindings.entityId = entityId;

    ctrl = $componentController("hathiTrustAvailability", null, bindings);
    ctrl.$onInit();
    expect(ctrl.fullTextLink).toBe(link + "?signon=swle:" + entityId);
  });
});
