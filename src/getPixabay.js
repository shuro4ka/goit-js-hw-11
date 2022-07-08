import axios from 'axios';
const APIKEY = '28463198-9651460feed0dbf9f7cb6c698';

axios.defaults.baseURL = 'https://pixabay.com/api/';

export class GetPixabayAPI {
    constructor() { 
        this.searchQuery = ''; 
        this.page = 1; 
    }

    async fetchImages(){
        const params = new URLSearchParams({
            key: APIKEY,
            q: this.searchQuery,
            image_type: 'photo',
            orientation: 'horizontal',
            safesearch: true,
            page: this.page,
            per_page: 40,
        });
        
        const { data } = await axios.get(`?${params}`);
        this.incrementPage();
        return data;
    }

    get searchQueryy() {
        return this.searchQuery;
    }
    set searchQueryy(newSearchQuery){
        this.searchQuery = newSearchQuery;
    }

    incrementPage(){
        this.page +=1;
    }
    resetPage(){
        this.page = 1;
    }
}