const interpolate = points => {
    const difference = 0.003
    const newPoints = []

    for (let i = 0; i < points.length - 1; ++i) {
        const p1 = points[i]
        const p2 = points[i + 1]
        const dist = Math.sqrt(Math.pow(p1.lat - p2.lat, 2) + Math.pow(p1.lng - p2.lng, 2))
        const steps = parseInt(dist / difference)

        if (steps === 0 || isNaN(steps)) continue

        for (let s = 0; s <= steps; ++s) {
            newPoints.push({
                lat: p1.lat + s * (p2.lat - p1.lat) / steps,
                lng: p1.lng + s * (p2.lng - p1.lng) / steps,
            })
        }
    }

    return newPoints
}

const initMap = () => {
    const mapDomElement = document.getElementById('js-map')
    const data = JSON.parse('[{"lat":43.6803,"lng":-7.60375,"location_pl":"Viveiro, Hiszpania","date_formatted":"2019-12-06, 12:12","location":"Viveiro, Hiszpania","options":{"title":"Viveiro, Hiszpania","text":"2019-12-06, 12:12"}},{"lat":43.71795,"lng":-7.59605,"location_pl":null,"date_formatted":"2019-12-25, 05:12","location":"Na morzu ⛵"},{"lat":43.765367,"lng":-7.6195,"location_pl":null,"date_formatted":"2019-12-25, 05:12","location":"Na morzu ⛵"},{"lat":43.827783,"lng":-7.723633,"location_pl":null,"date_formatted":"2019-12-25, 05:12","location":"Na morzu ⛵"},{"lat":43.82855,"lng":-8.012633,"location_pl":null,"date_formatted":"2019-12-25, 05:12","location":"Na morzu ⛵"},{"lat":43.663583,"lng":-8.332867,"location_pl":null,"date_formatted":"2019-12-25, 05:12","location":"Na morzu ⛵"},{"lat":43.448783,"lng":-8.455217,"location_pl":null,"date_formatted":"2019-12-25, 05:12","location":"Na morzu ⛵"},{"lat":43.384467,"lng":-8.369417,"location_pl":null,"date_formatted":"2019-12-25, 05:12","location":"Na morzu ⛵"},{"lat":43.3618,"lng":-8.370367,"location_pl":null,"date_formatted":"2019-12-25, 05:12","location":"Na morzu ⛵"},{"lat":43.366083,"lng":-8.382683,"location_pl":"A Coruña, Hiszpania","date_formatted":"2019-12-25, 05:12","location":"A Coruña, Hiszpania","options":{"title":"A Coruña, Hiszpania","text":"2019-12-25, 05:12"}},{"lat":43.363633,"lng":-8.372317,"location_pl":null,"date_formatted":"2019-12-26, 21:12","location":"Na morzu ⛵"},{"lat":43.39205,"lng":-8.382883,"location_pl":null,"date_formatted":"2019-12-26, 21:12","location":"Na morzu ⛵"},{"lat":43.400733,"lng":-8.411317,"location_pl":null,"date_formatted":"2019-12-26, 21:12","location":"Na morzu ⛵"},{"lat":43.4086,"lng":-8.874217,"location_pl":null,"date_formatted":"2019-12-26, 21:12","location":"Na morzu ⛵"},{"lat":43.205767,"lng":-9.2354,"location_pl":null,"date_formatted":"2019-12-26, 21:12","location":"Na morzu ⛵"},{"lat":43.133017,"lng":-9.258666999999999,"location_pl":null,"date_formatted":"2019-12-26, 21:12","location":"Na morzu ⛵"},{"lat":43.11405,"lng":-9.208017,"location_pl":null,"date_formatted":"2019-12-26, 21:12","location":"Na morzu ⛵"},{"lat":43.105383,"lng":-9.2126,"location_pl":"Muxia, Hiszpania","date_formatted":"2019-12-26, 21:12","location":"Muxia, Hiszpania","options":{"title":"Muxia, Hiszpania","text":"2019-12-26, 21:12"}},{"lat":43.10665,"lng":-9.210333,"location_pl":null,"date_formatted":"2019-12-27, 17:12","location":"Na morzu ⛵"},{"lat":43.110133,"lng":-9.209733,"location_pl":null,"date_formatted":"2019-12-27, 17:12","location":"Na morzu ⛵"},{"lat":43.1204,"lng":-9.219417,"location_pl":null,"date_formatted":"2019-12-27, 17:12","location":"Na morzu ⛵"},{"lat":43.11565,"lng":-9.262483,"location_pl":null,"date_formatted":"2019-12-27, 17:12","location":"Na morzu ⛵"},{"lat":42.933433,"lng":-9.363333,"location_pl":null,"date_formatted":"2019-12-27, 17:12","location":"Na morzu ⛵"},{"lat":42.726817,"lng":-9.10165,"location_pl":null,"date_formatted":"2019-12-27, 17:12","location":"Na morzu ⛵"},{"lat":42.729233,"lng":-9.065883,"location_pl":null,"date_formatted":"2019-12-27, 17:12","location":"Na morzu ⛵"},{"lat":42.770817,"lng":-9.042067,"location_pl":null,"date_formatted":"2019-12-27, 17:12","location":"Na morzu ⛵"},{"lat":42.777533,"lng":-9.051983,"location_pl":"Muros, Hiszpania","date_formatted":"2019-12-27, 17:12","location":"Muros, Hiszpania","options":{"title":"Muros, Hiszpania","text":"2019-12-27, 17:12"}}]');
    
    /*
        My data set is quite sparse, so I need to interpolate it in order to have a smooth animation
        with a constant speed. If your points are distributed evenly, feel free to skip interpolate()
        function call.
    */
    const points = interpolate(data)

    /* Initialise map */
    
    const map = new google.maps.Map(mapDomElement, {
        zoom: 9, 
        center: points[0],
        disableDefaultUI: true,
    })

    /* Draw line for our route */

    const route = new google.maps.Polyline({
        path: points.slice(0, 1),
        geodesic: true,
        strokeColor: 'red',
        strokeOpacity: 1.0,
        strokeWeight: 2
    })

    route.setMap(map)

    const marker = new google.maps.Marker({
        position: points[0],
        map: map,
        icon: {
            url: 'marker.png',
            size: new google.maps.Size(36, 36),
            anchor: new google.maps.Point(18, 18),
            scaledSize: new google.maps.Size(36, 36),
        }
    })

    let i = 0

    const step = function () {
        const path = route.getPath()
        const newPoint = new google.maps.LatLng(points[i].lat, points[i].lng)
        path.push(newPoint)
        route.setPath(path)
        map.setCenter(newPoint)
        marker.setPosition(newPoint)
        if (++i < points.length) {
            window.requestAnimationFrame(step)
        }
    }

    window.requestAnimationFrame(step)
}

window.initMap = initMap
