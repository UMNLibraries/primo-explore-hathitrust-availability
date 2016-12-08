app.factory('hathiTrust', ['$http', '$q', function ($http, $q) {
  var svc = {};
  var hathiTrustBaseUrl = "https://catalog.hathitrust.org/api/volumes/brief/json/";

  svc.findFullViewRecord = function (ids) {
    var hathiTrustFullTextRecord = false;
    var deferred = $q.defer();
    if (ids.length) {
      var hathiTrustLookupUrl = hathiTrustBaseUrl + ids.join('|') + "?callback=JSON_CALLBACK";
      $http.jsonp(hathiTrustLookupUrl, { cache: true }).success(function (data) {
        for (var i = 0; !hathiTrustFullTextRecord && i < ids.length; i++) {
          var result = data[ids[i]];
          for (var j = 0; j < result.items.length; j++) {
            var item = result.items[j];
            if (item.usRightsString.toLowerCase() == "full view") {
              hathiTrustFullTextRecord = result.records[item.fromRecord].recordURL;
              break;
            }  
          }  
        }  
        deferred.resolve(hathiTrustFullTextRecord);
      });
    } else {
      deferred.resolve(false);
    }  
    return deferred.promise;
  }; 
  return svc;
}]);
