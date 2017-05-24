angular.module('hathiTrustAvailability').factory('hathiTrust', ['$http', '$q', function ($http, $q) {
  var svc = {};
  var hathiTrustBaseUrl = "https://catalog.hathitrust.org/api/volumes/brief/json/";

  svc.findFullViewRecord = function (ids) {
    var deferred = $q.defer();

    var handleResponse = function(resp) {
      var data = resp.data;
      var fullTextUrl = null;
      for (var i = 0; !fullTextUrl && i < ids.length; i++) {
        var result = data[ids[i]];
        for (var j = 0; j < result.items.length; j++) {
          var item = result.items[j];
          if (item.usRightsString.toLowerCase() === "full view") {
            fullTextUrl = result.records[item.fromRecord].recordURL;
            break;
          }  
        }  
      }  
      deferred.resolve(fullTextUrl);
    }

    if (ids.length) {
      var hathiTrustLookupUrl = hathiTrustBaseUrl + ids.join('|');
      $http.jsonp(hathiTrustLookupUrl, { cache: true , jsonpCallbackParam: 'callback', headers:{"X-From-ExL-API-Gateway": undefined}})
        .then(handleResponse)
        .catch(function(e) {console.log(e)});
    } else {
      deferred.resolve(null);
    }  

    return deferred.promise;
  }; 

  return svc;

}]);
