# primo-explore-hathitrust-availability

![Build Status](https://api.travis-ci.org/UMNLibraries/primo-explore-hathitrust-availability.svg?branch=master)

## Features
When search results are displayed, a record's OCLC numbers are passed to the [HathiTrust Bib API](https://www.hathitrust.org/bib_api). If at least one item with free full-text access is found, a link to the HathiTrust record is appended to the availability section. 

### Screenshot
![screenshot](screenshots/screenshot.png)

## Install
1. Make sure you've installed and configured [primo-explore-devenv](https://github.com/ExLibrisGroup/primo-explore-devenv).
2. Navigate to your template/central package root directory. For example: 
    ```
    cd primo-explore/custom/MY_VIEW_ID
    ```
3. If you do not already have a `package.json` file in this directory, create one: 
    ```
    npm init -y
    ```
4. Install this package: 
    ```
    npm install primo-explore-hathitrust-availability --save-dev
    ```

## Usage
Once this package is installed, add `hathiTrustAvailability` as a dependency for your custom module definition, and then add the `hathi-trust-availability` directive to the `prmSearchResultAvailabilityLineAfter` component. For example:

```javascript
var app = angular.module('viewCustom', ['hathiTrustAvailability']);

app.component('prmSearchResultAvailabilityLineAfter', {
    template: '<hathi-trust-availability></hathi-trust-availability>'
  });
```
Note: If you're using the `--browserify` build option, you will need to first import the module with:

```javascript 
import 'primo-explore-hathitrust-availability';
```

The idea here is to allow multiple custom components to be added to the `prmSearchResultAvailabilityLineAfter` rather than attempting to redefine it. 

By default, the component will display full-text links for any resource. If you want it avoid looking for full-text availability on records for which you already have an online copy, you can add a `hide-online=tue` attribute to the component: 

```html
<hathi-trust-availability hide-online="true"></hathi-trust-availability>
```

The default availability message is "Full Text Available at HathiTrust". You can override this by setting the `msg` attribute:

```html
<hathi-trust-availability hide-online="true" msg="WOW, HathiTrust! Lucky you!"></hathi-trust-availability>
```

If you want to display full-text links to *any* HathiTrust record, regardless of copyright status, use the `ignore-copyright` attribute: 

```html
<hathi-trust-availability ignore-copyright="true"></hathi-trust-availability>
```


## Running tests
1. Clone the repo
2. Run `npm install`
3. Run `npm test`
