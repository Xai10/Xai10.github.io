function initMaps() {
    var mapLeft, mapRight, center, placeService, searchInput;

    center = {lat: 43.7224449, lng: 10.3966397};

    mapLeft = new google.maps.Map(document.getElementById('map-left'), {
        center: center,
        zoom: 5,
        zoomControl: true,
        mapTypeControl: false,
    });

    placeService = new google.maps.places.PlacesService(mapLeft);

    mapRight = new google.maps.StreetViewPanorama(document.getElementById('map-right'), {
        position: center,
    });

    mapLeft.setStreetView(mapRight);

    searchInput = new google.maps.places.Autocomplete(document.getElementById('search-input'));
    searchInput.addListener('place_changed', function() {
        searchInput.setBounds(mapLeft.getBounds());

        if(searchInput.getPlace().geometry) {
            mapLeft.panTo(searchInput.getPlace().geometry.location);
            mapRight.setPosition(searchInput.getPlace().geometry.location);
            mapRight.setVisible(true);
        }
    });

    jQuery('.find-btn').on('click', function() {
        placeService.textSearch({query: jQuery('#search-input').val()}, function(placeResults, placesServiceStatus) {
            if(placesServiceStatus == 'OK') {
                mapLeft.panTo(placeResults[0].geometry.location);
                mapRight.setPosition(placeResults[0].geometry.location);
                mapRight.setVisible(true);
            }
            else if (placesServiceStatus == 'ZERO_RESULTS') {
                alert('Could not find any places');
            }
            else {
                alert('Search failed with status ' + placesServiceStatus);
            }
        });
    });

    jQuery('.find-me-btn').on('click', function() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                var geoLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };

                mapLeft.panTo(geoLocation);
                mapRight.setPosition(geoLocation);
                mapRight.setVisible(true);
            }, function() {
                alert('Error: The Geolocation service failed');
            });
        } else {
            alert('Error: Your browser doesn\'t support geolocation');
        }
    });
}
