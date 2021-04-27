

export const mapService = {
    initMap,
    addMarker,
    panTo,
    getCoorde,
    getUpdateUrl
}

var gMap;
const API_KEY = 'AIzaSyBE1CXSNnqtB9JqsicFV1CtmqEhb592YPY';
var gLocationUrl

function initMap(lat, lng) {
    console.log('InitMap');
    if (lat === null || lng === null) {
        lat = 32.0749831
        lng = 34.9120554 
    }
    return _connectGoogleApi()
        .then(() => {
            console.log('google available');
            gMap = new google.maps.Map(
                document.querySelector('#map'), {
                center: { lat, lng },
                zoom: 15
            })
            console.log('Map!', gMap);
        })
}

function addMarker(loc) {
    var marker = new google.maps.Marker({
        position: loc,
        map: gMap,
        title: 'Hello World!'
    });
    return marker;
}

function panTo(lat, lng) {
    var laLatLng = new google.maps.LatLng(lat, lng);
    gMap.panTo(laLatLng);
}



function _connectGoogleApi() {
    if (window.google) return Promise.resolve()

    var elGoogleApi = document.createElement('script');
    elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`;
    elGoogleApi.async = true;
    document.body.append(elGoogleApi);

    return new Promise((resolve, reject) => {
        elGoogleApi.onload = resolve;
        elGoogleApi.onerror = () => reject('Google script failed to load')
    })
}

function getCoorde(location) {
    const prm = axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=1600+${location}&key=${API_KEY}`)
    .then(res => {
        _updateLocationUrl(res.data)
        return res.data
        });
    return prm;
}

function _updateLocationUrl(data){
    var location = data.results[0].geometry.location
    gLocationUrl = `https://emoyal4.github.io/Travel-tip/index.html?lat=${location.lat}&lng=${location.lng}`
}

function getUpdateUrl(){
    return gLocationUrl
}