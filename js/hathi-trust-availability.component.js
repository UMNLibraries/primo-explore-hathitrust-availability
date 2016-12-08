app.component('hathiTrustAvailability', {
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
              {{$ctrl.msg}}\
                <prm-icon external-link="" icon-type="svg" svg-icon-set="primo-ui" icon-definition="open-in-new"></prm-icon>\
              </a>\
            </span>'

});

