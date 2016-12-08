app.controller('hathiTrustAvailabilityController', ['hathiTrust', function (hathiTrust) {
  var self = this;

  self.$onInit = function() {
    self.parentCtrl = this.parent.parentCtrl;
    if ( !(isOnline() && self.hideOnline) ) {
      updateHathiTrustAvailability();
    }  
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

}]);
