import axios from 'axios';

async function fetchImages(query, page = 1) {
    const API_KEY = '46136596-f3a48b293dc28723065feba0c';  
    const URL = `https://pixabay.com/api/?key=${API_KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`;
    

  try {
    const response = await axios.get(URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching images:', error);
    throw error;
  }
}

let currentPage = 1;
let currentQuery = '';
let totalHits = 0;

const form = document.querySelector('#search-form');  
const gallery = document.querySelector('#gallery');  
const loadMoreBtn = document.getElementById('load-more');

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  currentQuery = event.target.query.value;
  currentPage = 1;
  gallery.innerHTML = ''; 
  loadMoreBtn.hidden = true;  
  
  const data = await fetchImages(currentQuery, currentPage);
  renderGallery(data.hits);
  totalHits = data.totalHits;
  if (totalHits > 40) {
    loadMoreBtn.hidden = false;
  }
});

loadMoreBtn.addEventListener('click', async () => {
  currentPage += 1;
  const data = await fetchImages(currentQuery, currentPage);
  renderGallery(data.hits);
  smoothScroll();

  if (currentPage * 40 >= totalHits) {
    loadMoreBtn.hidden = true;
    iziToast.info({ message: "We're sorry, but you've reached the end of search results." });
  }
});

function smoothScroll() {
  const { height: cardHeight } = document.querySelector('.gallery-item').getBoundingClientRect();
  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
