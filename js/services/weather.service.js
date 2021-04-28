export const weatherService = {
    getWeather
}

const WEATHER_API_KEY = 'a5014c01e8fb10f5ffda59bdba09fe11'

function getWeather(location){
    if (!location.lat || !location.lng) {
        location.lat = 32.0749831
        location.lng = 34.9120554
    }
   return axios.get(`http://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lng}&APPID=${WEATHER_API_KEY}`)
}
