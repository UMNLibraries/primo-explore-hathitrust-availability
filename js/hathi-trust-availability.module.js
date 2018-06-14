angular.module('hathiTrustAvailability', [])
  .constant('hathiTrustBaseUrl', "https://catalog.hathitrust.org/api/volumes/brief/json/")
  .config(['$sceDelegateProvider', 'hathiTrustBaseUrl', function($sceDelegateProvider, hathiTrustBaseUrl) {
    var urlWhitelist = $sceDelegateProvider.resourceUrlWhitelist();
    urlWhitelist.push(hathiTrustBaseUrl + '**')
    $sceDelegateProvider.resourceUrlWhitelist(urlWhitelist);
  }])
  .factory('hathiTrust', ['$http', '$q', function ($http, $q) {
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
        $http.jsonp(hathiTrustLookupUrl, { cache: true , jsonpCallbackParam: 'callback'})
          .then(handleResponse)
          .catch(function(e) {console.log(e)});
      } else {
        deferred.resolve(null);
      }  

      return deferred.promise;
    }; 

    return svc;

  }])
  .controller('hathiTrustAvailabilityController', ['hathiTrust', function (hathiTrust) {
    var self = this;

    self.$onInit = function() {
      setDefaults();
      if ( !(isOnline() && self.hideOnline) ) {
        updateHathiTrustAvailability();
      }  
    }  

    var setDefaults = function() {
      if (!self.msg) self.msg = 'Full Text Available at HathiTrust';
    }  

    var isOnline = function() {
      return self.prmSearchResultAvailabilityLine.result.delivery.GetIt1.some(function (g) {
        return g.links.some(function (l) {
          return l.isLinktoOnline;
        });
      });
    }  

    var updateHathiTrustAvailability = function() {
      var hathiTrustIds = (self.prmSearchResultAvailabilityLine.result.pnx.addata.oclcid || []).map(function (id) {
        return "oclc:" + id;
      });
      hathiTrust.findFullViewRecord(hathiTrustIds).then(function (res) {
        self.fullTextLink = res;
      });
    }  

  }])
  .component('hathiTrustAvailability', {
    require: {
      prmSearchResultAvailabilityLine: '^prmSearchResultAvailabilityLine'
    },
    bindings: { 
      hideOnline: '<', 
      msg: '@?'
    },
    controller: 'hathiTrustAvailabilityController',
    template: '<span ng-if="$ctrl.fullTextLink" class="umnHathiTrustLink">\
                <md-icon alt="HathiTrust Logo">\
                  <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="100%" height="100%" viewBox="0 0 16 16" enable-background="new 0 0 16 16" xml:space="preserve">  <image id="image0" width="16" height="16" x="0" y="0"\
                  xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAABGdBTUEAALGPC/xhBQAAACBjSFJN\
                  AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAACNFBMVEXuegXvegTsewTveArw\
                  eQjuegftegfweQXsegXweQbtegnsegvxeQbvegbuegbvegbveQbtegfuegbvegXveQbvegbsfAzt\
                  plfnsmfpq1/wplPuegXvqFrrq1znr2Ptok/sewvueQfuegbtegbrgRfxyJPlsXDmlTznnk/rn03q\
                  pVnomkjnlkDnsGnvwobsfhPveQXteQrutHDqpF3qnUnpjS/prmDweQXsewjvrWHsjy7pnkvqqGDv\
                  t3PregvqhB3uuXjusmzpp13qlz3pfxTskC3uegjsjyvogBfpmkHpqF/us2rttXLrgRjrgBjttXDo\
                  gx/vtGznjzPtfhHqjCfuewfrjCnwfxLpjC7wtnDogBvssmjpfhLtegjtnEjrtnTmjC/utGrsew7s\
                  o0zpghnohB/roUrrfRHtsmnlkTbrvH3tnEXtegXvegTveQfqhyHvuXjrrGTpewrsrmXqfRHogRjt\
                  q2Dqewvqql/wu3vqhyDueQnwegXuegfweQPtegntnUvnt3fvxI7tfhTrfA/vzJvmtXLunEbtegrw\
                  egTregzskjbsxI/ouoPsqFzniyrz2K3vyZnokDLpewvtnkv30J/w17XsvYXjgBbohR7nplnso1L0\
                  1Kf40Z/um0LvegXngBnsy5juyJXvsGftrGTnhB/opVHoew7qhB7rzJnnmErkkz3splbqlT3smT3t\
                  tXPqqV7pjzHvunjrfQ7vewPsfA7uoU3uqlruoEzsfQ/vegf///9WgM4fAAAAFHRSTlOLi4uLi4uL\
                  i4uLi4uLi4tRUVFRUYI6/KEAAAABYktHRLvUtndMAAAAB3RJTUUH4AkNDgYNB5/9vwAAAQpJREFU\
                  GNNjYGBkYmZhZWNn5ODk4ubh5WMQERUTl5CUEpWWkZWTV1BUYlBWUVVT19BUUtbS1tHV0zdgMDQy\
                  NjE1MzRXsrC0sraxtWOwd3B0cnZxlXZz9/D08vbxZfDzDwgMCg4JdQsLj4iMio5hiI2LT0hMSk5J\
                  TUvPyMzKzmHIzcsvKCwqLiktK6+orKquYZCuratvaGxqbmlta+8QNRBl6JQ26Oru6e3rnzBx0uQ8\
                  aVGGvJopU6dNn1E8c9bsOXPniYoySM+PXbBw0eIlS5fl1C+PFRFlEBUVXbFy1eo1a9fliQDZYIHY\
                  9fEbNm7avEUUJiC6ddv2HTt3mSuBBfhBQEBQSEgYzOIHAHtfTe/vX0uvAAAAJXRFWHRkYXRlOmNy\
                  ZWF0ZQAyMDE2LTA5LTEzVDE0OjA2OjEzLTA1OjAwNMgVqAAAACV0RVh0ZGF0ZTptb2RpZnkAMjAx\
                  Ni0wOS0xM1QxNDowNjoxMy0wNTowMEWVrRQAAAAASUVORK5CYII=" />\
                  </svg> \
                </md-icon>\
                <a target="_blank" ng-href="{{$ctrl.fullTextLink}}">\
                {{ ::$ctrl.msg }}\
                  <prm-icon external-link="" icon-type="svg" svg-icon-set="primo-ui" icon-definition="open-in-new"></prm-icon>\
                </a>\
              </span>'
  });
