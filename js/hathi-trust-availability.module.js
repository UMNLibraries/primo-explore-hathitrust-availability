angular
  .module('hathiTrustAvailability', [])
  .value('iconSrc', 'custom/CENTRAL_PACKAGE/img/hathitrust.svg')
  .constant('hathiTrustBaseUrl', "https://catalog.hathitrust.org/api/volumes/brief/json/")
  .config(['$sceDelegateProvider', 'hathiTrustBaseUrl', ($sceDelegateProvider, hathiTrustBaseUrl) => {
    let urlWhitelist = $sceDelegateProvider.resourceUrlWhitelist();
    urlWhitelist.push(`${hathiTrustBaseUrl}**`)
    $sceDelegateProvider.resourceUrlWhitelist(urlWhitelist);
  }]);

