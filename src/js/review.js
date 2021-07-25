import InteractiveMap from './yamps';

export default class Review {
    constructor() {
        this.formTemplate = document.querySelector('#addFormTemplate').innerHTML;
        this.map = new InteractiveMap('map', this.onClick.bind(this));
        this.map.init().then(this.onInit.bind(this));
        this.reviews = [];

        // console.log(this.formTemplate);
        // const root = document.createElement('div');
        // root.innerHTML = this.formTemplate;
        // console.log(root);
        // const reviewList = root.querySelector('.review-list');
        // console.log(reviewList);
        // const reviewForm = root.querySelector('[data-role=review-form]');
        // console.log(reviewForm);

    }
    // let storage = localStorage;
    // почему здесь нельзя писать код?

    onInit() {

        // const data = JSON.parse(storage.data || '{}');
        // const coords = data.coords;
        // const coords = await this.callApi('coords');
        // // const coords = e.get('coords');

        // for (let item of coords) {
        //     for (let i = 0; i < item.length; i++) { // item.total почему не length
        //         this.map.createPlacemark(item.coords);
        //         console.log(this);
        //     }
        // }

        document.body.addEventListener('click', this.onDocumentClick.bind(this)); 
    }

    // localStorage() {

        // storage.data = JSON.stringify({
    //         coords: e.get('coords'),
    //         review: {
    //             name: document.querySelector('[data-role=review-name]').value,
    //             place: document.querySelector('[data-role=review-place]').value,
    //             text: document.querySelector('[data-role=review-text]').value,
    //         }
        // })
    // }

    // async callApi(method, body = {}) {
    //     const res = await fetch(`./src/${method}`, {
    //         method: 'post',
    //         body: JSON.stringify(body),
    //     });

    //     return await res.json();
    // }

    createForm(coords, reviews) {
        const root = document.createElement('div');
        root.innerHTML = this.formTemplate;
        const reviewList = root.querySelector('.review-list'); 
        const reviewForm = root.querySelector('[data-role=review-form]');
        reviewForm.dataset.coords = JSON.stringify(coords);

        // const div = document.createElement('div');
        // div.classList.add('review-item');
        // div.innerHTML = `
        // <div>
        // <b>${list.name}</b> [${list.place}]
        // </div>
        // <div>${list.text}</div>
        // `;
        // reviewList.appendChild(div);

        for (const item of reviews) {
            console.log(parseFloat(item.coords));
            console.log(parseFloat(coords));
            console.log(parseFloat(item.coords) === parseFloat(coords));
            if (parseFloat(item.coords) === parseFloat(coords)){
                const div = document.createElement('div');
                div.classList.add('review-item');
                div.innerHTML = `
                <div>
                    <b>${item.name}</b> [${item.place}]
                </div>
                <div>${item.text}</div>
                `;
                reviewList.appendChild(div);
            }
        }

        return root;
    }

    async onClick(coords) {
        // this.map.openBalloon(coords, 'Загрузка...'); // это яндекс так позволяет сделать
        // const list = await this.callApi('list', {coords})
        // const data = JSON.parse(storage.data || '{}');
        // const list = await data.review;
        // const form = this.createForm(coords, list); //откуда здесь берутся координаты? Я так понимаю из 94 строчки кода yamps
        // const reviews = this.saveReviews();
        const reviews = this.reviews;
        console.log(reviews);
        // console.log(coords);
        const form = this.createForm(coords, reviews)

        this.map.openBalloon(coords, form.innerHTML);
    }

    // pushReview() {
    //     const reviews = [];
    //     const list = this.saveReviews();
    //     reviews.push(list);
    //     return reviews;
    // }

    saveReviews(list) {
        const reviews = this.reviews;

        // const list = {
        //     name: document.querySelector('[data-role=review-name]').value,
        //     place: document.querySelector('[data-role=review-place]').value,
        //     text: document.querySelector('[data-role=review-text]').value,
        // }
        reviews.push(list);

        return reviews;
    }

    async onDocumentClick(e) {
        if (e.target.dataset.role === 'review-add') {
            const reviewForm = document.querySelector('[data-role=review-form]');
            const reviewList = document.querySelector('.review-list');
            console.log(reviewList);
            const coords = JSON.parse(reviewForm.dataset.coords);
            const list = {
                    coords: coords,
                    name: document.querySelector('[data-role=review-name]').value,
                    place: document.querySelector('[data-role=review-place]').value,
                    text: document.querySelector('[data-role=review-text]').value,
            }
            // const data = {
            //     coords,
            //     review: {
            //         name: document.querySelector('[data-role=review-name]').value,
            //         place: document.querySelector('[data-role=review-place]').value,
            //         text: document.querySelector('[data-role=review-text]').value,
            //     },
            // };
                // await this.callApi('add', data);
                this.saveReviews(list);
                // const form = this.createForm(coords);
                // this.map.openBalloon(coords, form.innerHTML);
                this.map.createPlacemark(coords);
                this.map.closeBalloon();
        }
    }
}