import InteractiveMap from './yamps';

export default class Review {
    constructor() {
        this.formTemplate = document.querySelector('#addFormTemplate').innerHTML;
        this.map = new InteractiveMap('map', this.onClick.bind(this));
        this.map.init().then(this.onInit.bind(this));
        this.reviews = [];
    }
    // let storage = localStorage;
    // почему здесь нельзя писать код?

    onInit() {
        document.body.addEventListener('click', this.onDocumentClick.bind(this)); 
    }

    createForm(coords, reviews) {
        const root = document.createElement('div');
        root.innerHTML = this.formTemplate;
        const reviewList = root.querySelector('.review-list'); 
        const reviewForm = root.querySelector('[data-role=review-form]');
        reviewForm.dataset.coords = JSON.stringify(coords);

        for (const item of reviews) {
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

    onClick(coords) {
        const reviews = this.reviews;
        const form = this.createForm(coords, reviews)

        this.map.openBalloon(coords, form.innerHTML);
    }

    saveReviews(list) {
        const reviews = this.reviews;
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

            this.saveReviews(list);
            this.map.createPlacemark(coords);
            this.map.closeBalloon();
        }
    }
}