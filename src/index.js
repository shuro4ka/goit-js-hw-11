import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { GetPixabayAPI } from './getPixabay';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const galleryRef = document.querySelector('.gallery');
const formRef = document.querySelector('.search-form');
const loadMoreBtnRef = document.querySelector('.load-more');
const getPixabayAPI = new GetPixabayAPI();

getPixabayAPI.fetchImages();
formRef.addEventListener('submit', onFormSubmit);
loadMoreBtnRef.addEventListener('click', onLoadMoreBtnClick);

function makeGalleryMarkup(searchedImages) {
    return searchedImages.map(({ 
        webformatURL, 
        largeImageURL, 
        tags, 
        likes, 
        views, 
        comments, 
        downloads, 
    }) => 
  `<div class="photo-card">
    <a href="${largeImageURL}">
    <img src=${webformatURL} alt= ${tags} loading="lazy" />
    <div class="info">
      <p class="info-item">
        <b>Likes: ${likes}</b>
      </p>
      <p class="info-item">
        <b>Views: ${views}</b>
      </p>
      <p class="info-item">
        <b>Comments: ${comments}</b>
      </p>
      <p class="info-item">
        <b>Downloads: ${downloads}</b>
      </p></a>
    </div>
  </div>`).join("");
   
}
function renderGallery(searchedImages){
    galleryRef.insertAdjacentHTML('beforeend', makeGalleryMarkup(searchedImages));
}

async function onFormSubmit(e){
    e.preventDefault();
    loadMoreBtnRef.style.display = 'none';

    clearGalleryMarkup();
    getPixabayAPI.resetPage();
    const request = e.target.elements.searchQuery.value.trim();

    if(!request) {
      return Notify.info("Input the text");
    }
    
    getPixabayAPI.searchQueryy = request;

    try {
      const { hits, totalHits } = await getPixabayAPI.fetchImages();
      
      if(!totalHits) {
        formRef.reset();
        return Notify.warning(
          "Sorry, there are no images matching your search query. Please try again."
        );
      }
        
      Notify.success(`Hooray! We found ${ totalHits } images.`);
      renderGallery(hits);
      loadMoreBtnRef.style.display = 'block';
      lightbox.refresh();
    } catch(err) { 
      console.log(err.message);
    }

    e.target.reset();    
  }

async function onLoadMoreBtnClick(){
  try {
    const { hits, totalHits } = await getPixabayAPI.fetchImages();
    renderGallery(hits);

    const totalRendered = document.querySelectorAll('.photo-card').length;
    if(totalRendered >= totalHits) {
      Notify.info("We're sorry, but you've reached the end of search results.");
      loadMoreBtnRef.style.display = 'none';
    }
    
    lightbox.refresh();

    const { height: cardHeight } = document
      .querySelector(".gallery")
      .firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: "smooth",
    });

  } catch (err) {
    console.log(err.message);
  }
}

function clearGalleryMarkup() {
  galleryRef.innerHTML = '';
}

const lightbox = new SimpleLightbox('.gallery a', { 
  captionsData: 'alt',
  captionDelay: 300,
});