var app = angular.module('viewCustom', []);

app.factory('hathiTrust', ['$http', '$q', function($http, $q) { 
  var svc = {};
  var hathiTrustBaseUrl = "https://catalog.hathitrust.org/api/volumes/brief/json/";

  svc.findFullViewRecord = function(ids) {
    var hathiTrustFullTextRecord = false;
    var deferred = $q.defer();
    if (ids.length) {
      var hathiTrustLookupUrl = hathiTrustBaseUrl + ids.join('|') + "?callback=JSON_CALLBACK";
      $http.jsonp(hathiTrustLookupUrl, {cache: true}).success(function(data) {
        for (var i=0; !hathiTrustFullTextRecord && i < ids.length; i++) {
          var result = data[ids[i]];
          for (var j=0; j < result.items.length; j++) {
            var item = result.items[j];
            if (item.usRightsString.toLowerCase() == "full view") {
              hathiTrustFullTextRecord = result.records[item.fromRecord].recordURL;
              break;
            }
          }
        }
        deferred.resolve(hathiTrustFullTextRecord);
      });
    } else { deferred.resolve(false); }
    return deferred.promise;
  };

  return svc;
}]);

app.controller('prmSearchResultAvailabilityLineAfterController', ['hathiTrust', function(hathiTrust) {
  var ctrl = this;
	var availableOnline = this.parentCtrl.result.delivery.GetIt1.some(function(g) {
													return g.links.some(function(l) {
														return l.isLinktoOnline})});

	if (!availableOnline) {
  	var hathiTrustIds = (this.parentCtrl.result.pnx.addata.oclcid || []).map(function(id){return "oclc:"+id});
 		hathiTrust.findFullViewRecord(hathiTrustIds).then(function(res) {ctrl.hathiTrustFullText = res});
	}

}]);

app.component('prmSearchResultAvailabilityLineAfter', {
  bindings: { parentCtrl: '<' },
  controller: 'prmSearchResultAvailabilityLineAfterController',
  template: '<span class="umnHathiTrustLink"><a target="_blank" ng-if="$ctrl.hathiTrustFullText" ng-href="{{$ctrl.hathiTrustFullText}}">Full Text Available at HathiTrust<prm-icon external-link="" icon-type="svg" svg-icon-set="primo-ui" icon-definition="open-in-new"></prm-icon></a></span>'
});

