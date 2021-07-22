// function initMap() {
//     ymaps.ready(() => {
//         let moscowPoint = new ymaps.Map("map", {
//             center: [55.76, 37.6],
//             zoom: 11,
//             controls: [],
//         });

//         // let placemark = new ymaps.Placemark(moscowPoint.getCenter(), {
//         //     balloonContentHeader: '<h2>Отзыв:</h2>',
//         //     balloonContentBody: [
//         //         '<form>'+
//         //         '<input name="name" placeholder="Укажите ваше имя"><br>' +
//         //         '<input name="place" placeholder="Укажите место"><br>' +
//         //         '<textarea class="textarea" placeholder="Оставьте отзыв"></textarea><br>' +
//         //         '<button class="add-button">Добавить</button>' +
//         //         '<form>'
//         //     ]
//         // });
//         const myCollection = new ymaps.GeoObjectCollection({}, { // где то в 1 параметре null??
//             draggable: false,
//             balloonContentHeader: '<h2>Отзыв:</h2>',
//             balloonContentBody: [
//                 '<form>'+
//                 '<input name="name" placeholder="Укажите ваше имя"><br>' +
//                 '<input name="place" placeholder="Укажите место"><br>' +
//                 '<textarea class="textarea" placeholder="Оставьте отзыв"></textarea><br>' +
//                 '<button class="add-button">Добавить</button>' +
//                 '<form>'
//             ]
//         });

//         moscowPoint.events.add('click', function(e) {
//             let coords = [];
//             let coordObj = e.get('coords');
            
//             coords = coordObj.concat(coordObj);
//             console.log(coords);
//             for (let coord of coords) {
//                 myCollection.add(new ymaps.Placemark(coord));
//             }
//             // moscowPoint.geoObjects.add(myCollection);
//             // myCollection.balloon.open();
//         });
//         // moscowPoint.geoObjects.add(placemark);
//         // // Откроем балун на метке.
//         // placemark.balloon.open();
//     })
// }

// export {
//     initMap
// }

export default class InteractiveMap{
    constructor(mapId, onClick) {
        this.mapId = mapId; /// ??
        this.onClick = onClick;
    } 

    async init() {
        await this.injectYMapsScript();
        await this.loadYMaps();
        this.initMap(); //почему нет await? 
    }

    injectYMapsScript() {
        return new Promise((resolve) =>{
            const ymapsScript = document.createElement('script');
            ymapsScript.src = 'https://api-maps.yandex.ru/2.1/?lang=ru_RU'; //why we need api key?
            document.body.appendChild(ymapsScript);
            ymapsScript.addEventListener('load', resolve);
        });
    }

    loadYMaps() {
        return new Promise((resolve) => ymaps.ready(resolve));  /// why we need this?
    }

    initMap() {
        this.clusterer = new ymaps.Clusterer({
            groupByCoordinates: true,
            clusterDisableClickZoom: true,
            clusterOpenBalloonOnClick: false,
        });
        this.clusterer.events.add('click', (e) => {
            const coords = e.get('target').geometry.getCoordinates();
            this.onClick(coords);
        });
        this.map = new ymaps.Map(this.mapId, {
            center: [55.76, 37.64],
            zoom: 10,
        });
        this.map.events.add('click', (e) => this.onClick(e.get('coords')));
        this.map.geoObjects.add(this.clusterer);
    }

    openBalloon(coords, content) {
        this.map.balloon.open(coords, content);
    }

    setBalloonContent(content) {
        this.map.balloon.setData(content);
    }
    
    closeBalloon() {
        this.map.balloon.close();
    }

    createPlacemark(coords) {
        const placemark = new ymaps.Placemark(coords);
        placemark.events.add('click', () => {
            const coords = e.get('target').geometry.getCoordinates();
            this.onClick(coords);
        });
        this.clusterer.add(placemark);
    }
}