import { storageService } from './storage-service.js'

export const locService = {
    getLocs,
    addLoc,
    removeLoc
}

const MY_LOCATION_LIST_KEY = 'my location list';


// var gLocs = [];
var gLocs = storageService.loadFromStorage(MY_LOCATION_LIST_KEY)


function getLocs() {
    gLocs = storageService.loadFromStorage(MY_LOCATION_LIST_KEY);
    return gLocs;
}


function addLoc(locationName, locationCoorde) {
    if (!gLocs) gLocs = [];
    gLocs.push({ name: locationName, lat: locationCoorde.lat, lng: locationCoorde.lng ,searchAt:Date.now()})
    storageService.saveToStorage(MY_LOCATION_LIST_KEY, gLocs)
}


function removeLoc(idx){
    gLocs = storageService.loadFromStorage(MY_LOCATION_LIST_KEY);
    console.log(idx,'remove');
    gLocs.splice(idx,1);
    storageService.saveToStorage(MY_LOCATION_LIST_KEY, gLocs)
}






// function getLocs() {
//     return new Promise((resolve, reject) => {
//         setTimeout(() => {
//             locs = storageService.loadFromStorage(MY_LOCATION_LIST_KEY)
//             if (!locs) locs = [];
//             resolve(locs);
//         }, 2000)
//     });
// }