angular.module('hathiTrustAvailability')
.controller('hathiTrustAvailabilityController', ['hathiTrust', function (hathiTrust) {
  var self = this;

  self.$onInit = function() {
    self.parentCtrl = this.parent.parentCtrl;
    setDefaults();
    if ( !(isOnline() && self.hideOnline) ) {
      updateHathiTrustAvailability();
    }  
  }  

  var setDefaults = function() {
    if (!self.msg) self.msg = 'Full Text Available at HathiTrust';
  }  

  var isOnline = function() {
    return self.parentCtrl.result.delivery.GetIt1.some(function (g) {
      return g.links.some(function (l) {
        return l.isLinktoOnline;
      });
    });
  }  

  var updateHathiTrustAvailability = function() {
    var hathiTrustIds = (self.parentCtrl.result.pnx.addata.oclcid || []).map(function (id) {
      return "oclc:" + id;
    });
    hathiTrust.findFullViewRecord(hathiTrustIds).then(function (res) {
      self.fullTextLink = res;
    });
  }  

}])
.component('hathiTrustAvailability', {
  require: {
    parent: '^prmSearchResultAvailabilityLineAfter'
  },
  bindings: { 
    hideOnline: '<', 
    msg: '@?'
  },
  controller: 'hathiTrustAvailabilityController',
  template: '<span class="umnHathiTrustLink">\
              <a target="_blank" ng-if="$ctrl.fullTextLink" ng-href="{{$ctrl.fullTextLink}}">\
              {{ ::$ctrl.msg }}\
                <prm-icon external-link="" icon-type="svg" svg-icon-set="primo-ui" icon-definition="open-in-new"></prm-icon>\
              </a>\
            </span>'

});

