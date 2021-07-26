export default class InteractiveMap{
    constructor(mapId, onClick) {
        this.mapId = mapId; 
        this.onClick = onClick;
    } 

    async init() {
        await this.injectYMapsScript();
        await this.loadYMaps();
        this.initMap();  
    }

    injectYMapsScript() {
        return new Promise((resolve) =>{
            const ymapsScript = document.createElement('script');
            ymapsScript.src = 'https://api-maps.yandex.ru/2.1/?apikey=2af2b511-53cc-4521-834e-50edd76ae159&lang=ru_RU';
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
            console.log(e.get('target').geometry.getCoordinates());
            console.log(e.get('coords'));
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
        placemark.events.add('click', (e) => {
            const clickCoords = e.get('coords');
            this.onClick(clickCoords);
        });
        this.clusterer.add(placemark);
    }
}