import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'

window.onload = onInit;

function onInit() {
    addEventListenrs();
    var location = getLocationFromUrl()
    mapService.initMap(location.lat,location.lng)
        .then(() => {
            console.log('Map is ready');
        })
        .catch(() => console.log('Error: cannot init map'));
}

function addEventListenrs() {
    document.querySelector('.btn-pan').addEventListener('click', (ev) => {
        mapService.panTo(35.6895, 139.6917);
    })
    document.querySelector('.copy-location-btn').addEventListener('click', (ev) => {
        var url = mapService.getUpdateUrl();
        navigator.clipboard.writeText(url)
        Swal.fire(
            'copy!',
            `use Ctrl+V to paste`,
            'success'
        )

    })
    document.querySelector('.search-btn').addEventListener('click', (ev) => {
        var locationTxt = document.querySelector('.location-search').value;
        mapService.getCoorde(locationTxt)
            .then(location => {
                console.log(location);
                var locationCoordes = location.results[0].geometry.location;
                mapService.panTo(locationCoordes.lat, locationCoordes.lng);
                locService.addLoc(locationTxt, locationCoordes);
                renderLocationTitle(location.results[0].formatted_address);
            });
    })
    document.querySelector('.btn-add-marker').addEventListener('click', (ev) => {
        console.log('Adding a marker');
        mapService.addMarker({ lat: 32.0749831, lng: 34.9120554 });
    })
    document.querySelector('.btn-get-locs').addEventListener('click', (ev) => {
        locService.getLocs()
            .then(locs => {
                console.log('Locations:', locs)
                document.querySelector('.locs').innerText = JSON.stringify(locs)
            })

    })
    document.querySelector('.btn-user-pos').addEventListener('click', (ev) => {
        getPosition()
            .then(pos => {
                console.log('User position is:', pos.coords);
                document.querySelector('.user-pos').innerText =
                    `Latitude: ${pos.coords.latitude} - Longitude: ${pos.coords.longitude}`
            })
            .catch(err => {
                console.log('err!!!', err);
            })
    })
}


// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
    console.log('Getting Pos');
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}

function renderLocationTitle(locationName) {
    document.querySelector('.location-title').innerText = locationName;
}

function getLocationFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const lat = urlParams.get('lat');
    const lng = urlParams.get('lng');
    return {lat , lng}
}

