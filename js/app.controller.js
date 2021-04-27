import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'




window.onload = onInit;

function onInit() {
    var location = getLocationFromUrl()
    mapService.initMap(+location.lat, +location.lng)
        .then(() => {
            mapService.getMap().addListener("click", (mapsMouseEvent) => {
                var pos = JSON.stringify(mapsMouseEvent.latLng.toJSON(), null, 2);
                pos = JSON.parse(pos);
                mapService.getLocationFromCoorde(pos.lat, pos.lng)
                    .then(location => {
                        renderLocationTitle(location);
                        locService.addLoc(location, pos)
                        renderLocationTable();
                    })
            });
        })
        .catch(() => console.log('Error: cannot init map'));
    renderLocationTable();
    addEventListenrs();
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
                var locationCoordes = location.results[0].geometry.location;
                mapService.panTo(locationCoordes.lat, locationCoordes.lng);
                locService.addLoc(locationTxt, locationCoordes);
                renderLocationTitle(location.results[0].formatted_address);
                renderLocationTable();
            });
    })
    document.querySelector('.btn-add-marker').addEventListener('click', (ev) => {
        mapService.addMarker({ lat: 32.0749831, lng: 34.9120554 });
    })
    // document.querySelector('.btn-get-locs').addEventListener('click', (ev) => {
    //     locService.getLocs()
    //         .then(locs => {
    //             document.querySelector('.locs').innerText = JSON.stringify(locs)
    //         })

    // })
    document.querySelector('.btn-user-pos').addEventListener('click', (ev) => {
        getPosition()
            .then(pos => {

                document.querySelector('.user-pos').innerText =
                    `Latitude: ${pos.coords.latitude} - Longitude: ${pos.coords.longitude}`
            })
            .catch(err => {
                console.log('err!!!', err);
            })
    })
    var elGoBtns = document.querySelectorAll('.to-address-btn');
    elGoBtns.forEach(function (btn) {
        btn.addEventListener('click', (ev) => {
            mapService.panTo(ev.target.dataset.lat, ev.target.dataset.lng)
        })
    })
    var elRemoveBtns = document.querySelectorAll('.remove-address-btn');
    elRemoveBtns.forEach(function (btn) {
        btn.addEventListener('click', (ev) => {
            locService.removeLoc(ev.target.dataset.idx)
        })
        
    })

}


// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
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
    return { lat, lng }
}

function renderLocationTable() {
    var locations = locService.getLocs()
    if (!locations) return;
    var strHtml = locations.map(function (location, idx) {
        return `<tr>
        <td>${location.name}</td>
        <td>lat: ${location.lat.toFixed(3)} lng: ${location.lng.toFixed(3)} </td>
        <td>${location.searchAt}</td>
        <td>
            <button class="to-address-btn" data-lat="${location.lat}" data-lng="${location.lng}">Go</button>
            <button class="remove-address-btn" data-idx="${idx}">Remove</button>
        </td>
    </tr>`;
    });

    document.querySelector('.table').innerHTML = strHtml.join('');


}

// var num = (15.46974).toFixed(2)
// console.log(num) // 15.47