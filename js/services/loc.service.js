export const locService = {
    getLocs,
    addLoc
}
var locs = [
    { name: 'Loc1', lat: 32.047104, lng: 34.832384 },
    { name: 'Loc2', lat: 32.047201, lng: 34.832581 }
]

function getLocs() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(locs);
        }, 2000)
    });
}


function addLoc(locationName,locationCoorde){
    locs.push({name:locationName,lat:locationCoorde.lat,lng:locationCoorde.lng})
    console.log(locs);
}

