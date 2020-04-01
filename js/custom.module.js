/**
 * This is only used to for testing/development
 * (see the npm start script).
 */
angular.module('viewCustom', ['hathiTrustAvailability'])
  .component('prmSearchResultAvailabilityLineAfter', {
    template: '<hathi-trust-availability ignore-copyright="true"></hathi-trust-availability>'
  });