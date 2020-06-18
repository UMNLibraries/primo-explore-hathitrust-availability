describe('hathiTrust service', function () {
  var hathiTrust, $httpBackend, $timeout;

  beforeEach(angular.mock.module('hathiTrustAvailability'));

  beforeEach(inject(function ($injector) {
    $httpBackend = $injector.get('$httpBackend');
    $timeout = $injector.get('$timeout');
    hathiTrust = $injector.get('hathiTrust');
    jasmine.getJSONFixtures().fixturesPath = 'base/test/fixtures';
  }));

  describe('findRecord', function () {
    it('should return any link, regardless of copyright status', function () {
      var data = getJSONFixture('oclc343816212.json');
      var url =
        'https://catalog.hathitrust.org/api/volumes/brief/json/oclc:343816212?callback=JSON_CALLBACK';
      var expectedFullTextLink =
        'https://catalog.hathitrust.org/Record/009815173';
      $httpBackend.expectJSONP(url).respond(data);
      hathiTrust.findRecord(['oclc:343816212']).then(function (res) {
        expect(res).toBe(expectedFullTextLink);
      });
      $httpBackend.flush();
    });

    it('should not return a link when no IDs are provided', function () {
      hathiTrust.findRecord([]).then(function (res) {
        expect(res).toBeFalsy();
      });
      $timeout.flush();
      $httpBackend.verifyNoOutstandingRequest;
    });

    it('should request multiple IDs when provided', function () {
      var url =
        'https://catalog.hathitrust.org/api/volumes/brief/json/oclc:1759490|oclc:19536513?callback=JSON_CALLBACK';
      $httpBackend.expectJSONP(url).respond(404, '');
      hathiTrust.findRecord(['oclc:1759490', 'oclc:19536513']);
      $httpBackend.flush();
    });

    /**
     * This scenario was created in response to a bug. In cases where multiple
     * identifiers are passed to the HT Bib API, it's possible that the first 
     * ID might not have any matching records, but the second ID *does* have 
     * matching records, so we need to check all records in the response until
     * a match is found.
     */
    it('should check all returned returned records until a match is found', function () {
      // the first obj in this response fixture has no matching HT inventory 
      var data = getJSONFixture('oclc25909689_oclc26033214.json');
      var url =
        'https://catalog.hathitrust.org/api/volumes/brief/json/oclc:26033214|oclc:25909689?callback=JSON_CALLBACK';
      var expectedFullTextLink =
        'https://catalog.hathitrust.org/Record/002543988';
      $httpBackend.expectJSONP(url).respond(data);
      hathiTrust
        .findRecord(['oclc:26033214', 'oclc:25909689'])
        .then(function (res) {
          expect(res).toBe(expectedFullTextLink);
        });
      $httpBackend.flush();
    });
  });

  describe('findFullViewRecord', function () {
    it('should return a link when full text is available', function () {
      var data = getJSONFixture('oclc3756332.json');
      var url =
        'https://catalog.hathitrust.org/api/volumes/brief/json/oclc:3756332?callback=JSON_CALLBACK';
      var expectedFullTextLink =
        'https://catalog.hathitrust.org/Record/007158726';
      $httpBackend.expectJSONP(url).respond(data);
      hathiTrust.findFullViewRecord(['oclc:3756332']).then(function (res) {
        expect(res).toBe(expectedFullTextLink);
      });
      $httpBackend.flush();
    });

    it('should not return a link when full text NOT is available', function () {
      var data = getJSONFixture('oclc343816212.json');
      var url =
        'https://catalog.hathitrust.org/api/volumes/brief/json/oclc:343816212?callback=JSON_CALLBACK';
      $httpBackend.expectJSONP(url).respond(data);
      hathiTrust.findFullViewRecord(['oclc:343816212']).then(function (res) {
        expect(res).toBeFalsy();
      });
      $httpBackend.flush();
    });

    it('should not return a link when no IDs are provided', function () {
      hathiTrust.findFullViewRecord([]).then(function (res) {
        expect(res).toBeFalsy();
      });
      $timeout.flush();
      $httpBackend.verifyNoOutstandingRequest;
    });

    it('should request multiple IDs when provided', function () {
      var url =
        'https://catalog.hathitrust.org/api/volumes/brief/json/oclc:1759490|oclc:19536513?callback=JSON_CALLBACK';
      $httpBackend.expectJSONP(url).respond(404, '');
      hathiTrust.findFullViewRecord(['oclc:1759490', 'oclc:19536513']);
      $httpBackend.flush();
    });

    it('should return the first full view record when multiple are available', function () {
      var data = getJSONFixture('oclc1586310_oclc7417753_oclc47076528.json');
      var url =
        'https://catalog.hathitrust.org/api/volumes/brief/json/oclc:1586310|oclc:7417753|oclc:47076528?callback=JSON_CALLBACK';
      var expectedFullTextLink =
        'https://catalog.hathitrust.org/Record/000637680';
      $httpBackend.expectJSONP(url).respond(data);
      hathiTrust
        .findFullViewRecord(['oclc:1586310', 'oclc:7417753', 'oclc:47076528'])
        .then(function (res) {
          expect(res).toBe(expectedFullTextLink);
        });
      $httpBackend.flush();
    });
  });
});
