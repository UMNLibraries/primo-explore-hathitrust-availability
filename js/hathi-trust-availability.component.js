angular.module('hathiTrustAvailability')
.controller('hathiTrustAvailabilityController', ['hathiTrust', 'iconSrc', function (hathiTrust, iconSrc) {
  var self = this;
  self.iconSrc = iconSrc;

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
              <md-icon md-svg-src="{{$ctrl.iconSrc}}" aria-label="HathiTrust"></md-icon>\
              <a target="_blank" ng-href="{{$ctrl.fullTextLink}}">\
              {{ ::$ctrl.msg }}\
                <prm-icon external-link="" icon-type="svg" svg-icon-set="primo-ui" icon-definition="open-in-new"></prm-icon>\
              </a>\
            </span>'

});

