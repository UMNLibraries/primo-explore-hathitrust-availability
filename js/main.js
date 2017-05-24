import HathiTrustAvailability from '../index.js'

angular
  .module('centralCustom', [HathiTrustAvailability])
  .component('prmSearchResultAvailabilityLineAfter', { 
    bindings: { parentCtrl: '<'},
    template: '<hathi-trust-availability></hathi-trust-availability>'
  });
