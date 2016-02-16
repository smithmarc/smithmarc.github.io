'use strict';

/* -- Objects -- */
var initialSteak = [{
  title: 'Eagle Falls Spur Steak and Grill',
  position: {
    lat: -31.71865,
    lng: 115.7817
  },
  suburb: 'Tapping'
}, {
  title: 'Eagle Rock Spur Steak and Grill',
  position: {
    lat: -31.7410,
    lng: 115.7396
  },
  suburb: 'Currambine'
}, {
  title: 'Outback Jacks Bar & Grill',
  position: {
    lat: -31.7965,
    lng: 115.7483
  },
  suburb: 'Hillarys'
}, {
  title: 'Hog\'s Breath Cafe',
  position: {
    lat: -31.6935,
    lng: 115.7133
  },
  suburb: 'Mindarie'
}, {
  title: 'Hurricane Grill',
  position: {
    lat: -31.8239,
    lng: 115.7393
  },
  suburb: 'Hillarys'
}];

/* -- Model -- */

var marker;
var infowindow;
var errorStatus = false;

var Steak = function(data) {
  this.title = ko.observable(data.title);
  this.position = ko.observable(data.position);
  this.suburb = ko.observable(data.suburb);
};

function error() {
  errorStatus = true;
  ko.applyBindings(new ViewModel());
}

function toggleBounce(clickedSteak) {
  if (clickedSteak.getAnimation() !== null) {
    clickedSteak.setAnimation(null);
  } else {
    clickedSteak.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function() {
      clickedSteak.setAnimation(null);
    }, 1400);
  }
}

// Here's a custom Knockout binding that makes elements shown/hidden via jQuery's fadeIn()/fadeOut() methods
// Could be stored in a separate utility library
ko.bindingHandlers.fadeVisible = {
    init: function(element, valueAccessor) {
        // Initially set the element to be instantly visible/hidden depending on the value
        var value = valueAccessor();
        $(element).toggle(ko.utils.unwrapObservable(value)); // Use "unwrapObservable" so we can handle values that may or may not be observable
    },
    update: function(element, valueAccessor) {
        // Whenever the value subsequently changes, slowly fade the element in or out
        var value = valueAccessor();
        ko.utils.unwrapObservable(value) ? $(element).fadeIn() : $(element).fadeOut();
    }
};

/* -- ViewModel -- */

var ViewModel = function() {
  var self = this;

  this.displayAdvancedOptions = ko.observable(true);
  this.displayError = ko.observable(false); // Error message visibility. Thanks to my reviewer.

  if (errorStatus === true) {
    this.displayError(true); // Display the error message
  }

  this.steakList = ko.observableArray([]);

  initialSteak.forEach(function(steakItem) {
    self.steakList.push(new Steak(steakItem));
  });

  this.currentSteak = ko.observable(this.steakList()[0]);

  this.setSteak = function(clickedSteak) {
    self.currentSteak(clickedSteak);
    google.maps.event.trigger(clickedSteak.marker, 'click');
    console.log("You clicked a location!");
  };

  this.places = ko.observableArray(initialSteak);

  this.query = ko.observable('');

  this.search = ko.computed(function() {

    infowindow.close();

    return ko.utils.arrayFilter(self.places(), function(place) {
      if (place.title.toLowerCase().indexOf(self.query().toLowerCase()) >= 0) {
        if (place.marker) {
          place.marker.setVisible(true);
          return true;
        }
        } else {
          if (place.marker) {
            place.marker.setVisible(false);
            return false;
          }
        }
    });
  });
};

function initMap() {
  // This variable will hold our maps styles
  var styles = [{
    "featureType": "all",
    "elementType": "all",
    "stylers": [{
      "visibility": "simplified"
    }, {
      "hue": "#1b5e20"
    }]
  }];

  // This is our map invokation
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {
      lat: -31.7450,
      lng: 115.7661
    },
    zoom: 12
  });

  // And here we invoke those styles created above
  map.setOptions({
    styles: styles
  });

  var inactiveMarker = 'img/inactive-marker.png';
  var activeMarker = 'img/active-marker.png';

  // Our array to store our markers
  var markers = [];

  infowindow = new google.maps.InfoWindow({});

  var len = initialSteak.length; // Reviewer suggestion

  // Here we loop through our objects array to create our markers
  for (var i = 0; i < len; i++) {
    var loc = initialSteak[i];
    marker = new google.maps.Marker({
      animation: google.maps.Animation.DROP,
      position: loc.position,
      title: loc.title,
      icon: inactiveMarker
    });

    marker.html =
      '<div id="content">' +
      '<h1 id="heading" class="heading">' + loc.title + '</h1>' +
      '<div id="wiki">' +
      '<h3>Wikipedia API:</h3>' +
      '</div>' +
      '</div>';

    // Set the markers on the map
    marker.setMap(map);

    // Link the markers to the list
    loc.marker = marker;

    // Push the markers into arrays
    markers.push(marker);

    // Listeners to bounce markers and open infowindows on click
    marker.addListener('click', function() {
      for (var j = 0; j < markers.length; j++) {
        markers[j].setIcon(inactiveMarker);
      }
      this.setIcon(activeMarker);
      // toggle marker bounce, pass clicked marker as parameter
      toggleBounce(this);
      infowindow.setContent(this.html);
      infowindow.open(map, this);
      getWikipedia(this);
    });
  }

  ko.applyBindings(new ViewModel());

}

function getWikipedia(clickedSteak) {

  var title = clickedSteak.title;
  var url = "https://en.wikipedia.org/w/api.php?action=opensearch&search=" + title + "&restaurant&format=json&callback=wikiCallback";
  //error handler for Wikipedia
  var wikiRequestTimeout = setTimeout(function() {
    var formattedInfo = '<div id="content">' +
    '<h1 id="heading" class="heading">' + title + '</h1>' +
    '<div id="wiki">' +
    '<h3>Wikipedia API:</h3>' +
    '</div>' +
    '</div>' + "<h5>An error occured with the Wikipedia API, please try again!</h5>";

    infowindow.setContent(formattedInfo);

  }, 8000);
  $.ajax({
    url: url,
    type: "POST",
    dataType: "jsonp",

    //displays Wikipedia info in infowindow and clears error handler timeout
    success: function(response) {
      var article = response[2][0];
      var formattedInfo = '<div id="content">' +
      '<h1 id="heading" class="heading">' + title + '</h1>' +
      '<div id="wiki">' +
      '<h3>Wikipedia API:</h3>' +
      '</div>' +
      '</div>' + "<h5>" + article + "</h5>";

      if (article === undefined) {
        formattedInfo = '<div id="content">' +
        '<h1 id="heading" class="heading">' + title + '</h1>' +
        '<div id="wiki">' +
        '<h3>Wikipedia API:</h3>' +
        '</div>' +
        '</div>' + "<h4>Sorry...</h4>" + "<h5>We couldn't find any related content from Wikipedia.</h5>";
      }
      clearTimeout(wikiRequestTimeout);

      infowindow.setContent(formattedInfo);
    },
  });
}

/**
  *   Some of my locations don't have Wikipedia pages...
  */
