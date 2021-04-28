import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'
import { weatherService } from './services/weather.service.js'




window.onload = onInit;
function onInit() {
    var location = getLocationFromUrl()
    mapService.getLocationFromCoorde(location)
        .then(name => renderLocationTitle(name))

    weatherService.getWeather(location)
        .then(weather => {
            renderWeather(weather.data)
        })
    mapService.initMap(+location.lat, +location.lng)
        .then(() => {
            mapService.getMap().addListener("click", (mapsMouseEvent) => {
                var pos = JSON.stringify(mapsMouseEvent.latLng.toJSON(), null, 2);
                pos = JSON.parse(pos);
                weatherService.getWeather(pos)
                    .then(weather => {
                        renderWeather(weather.data)
                    })
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
                weatherService.getWeather(locationCoordes)
                    .then(weather => {
                        renderWeather(weather.data)
                    })
            });
    })

    document.querySelectorAll('.to-address-btn').forEach(function (elBtn) {
        elBtn.addEventListener('click', (ev) => {
            mapService.panTo(ev.target.dataset.lat, ev.target.dataset.lng)
            weatherService.getWeather({ lan: ev.target.dataset.lat, lng: ev.target.dataset.lng })
                .then(weather => {
                    renderWeather(weather.data)
                })
        })
    })

    document.querySelectorAll('.remove-address-btn').forEach(function (elBtn) {
        elBtn.addEventListener('click', (ev) => {
            locService.removeLoc(ev.target.dataset.idx)
            renderLocationTable()
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
        <td class="btn-container">
            <button class="to-address-btn" data-lat="${location.lat}" data-lng="${location.lng}"><i data-lat="${location.lat}" data-lng="${location.lng}" class="fas fa-search-location fa-2x"></i></button>
            <button class="remove-address-btn" data-idx="${idx}"><i data-idx="${idx}" class="far fa-trash-alt fa-2x"></i></button>
        </td>
    </tr>`;
    });
    document.querySelector('.table').innerHTML = strHtml.join('');
    addEventListenrs();
}

function renderWeather(data) {
    const dataWeather = data.weather[0]
    const dataTemp = data.main
    var strHTML = ` 
    <div class="weather-header">
        <h3>Weather Today</h3>
        <img class="weather-icon" src="http://openweathermap.org/img/wn/${dataWeather.icon}@2x.png"/>
    </div>       
    <p class="location-info">${dataWeather.description}</p>
    <p class="weather-info">Temperrature: min: ${(dataTemp.temp_min - 273.15).toFixed(0)} C , max: ${(dataTemp.temp_max - 273.15).toFixed(0)} C</p>`
    document.querySelector('.weather-container').innerHTML = strHTML
}

