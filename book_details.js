const bookDetails = document.getElementById('book-details');
const bookResume = document.getElementById('book-resume');
const reviewStars = document.getElementsByClassName('review-stars');
const urlParams = new URLSearchParams(window.location.search);
const bookId = urlParams.get('id');

if (bookId) {
    const apiUrl = `https://www.googleapis.com/books/v1/volumes/${bookId}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(book => {
            const bookInfo = book.volumeInfo;

            const title = bookInfo.title || 'Titre inconnu';
            const author = bookInfo.authors ? bookInfo.authors.join(', ') : 'Auteur inconnu';
            const publisher = bookInfo.publisher || "Maison d'édition inconnu";
            const rating = bookInfo.averageRating || 'N/A';
            const pageCount = bookInfo.pageCount || 'N/A';
            const thumbnail = bookInfo.imageLinks ? bookInfo.imageLinks.thumbnail : '../../images/default-book.jpg';
            const description = bookInfo.description || 'Pas de description';

            const bookDetailHTML = `
                <section class="resume">
                    <div class="livre">
                        <img src="${thumbnail}" alt="Book cover">
                    </div>
                    <div class="description">
                        <div class="titre">
                            <p>${title}</p>
                        </div>
                        <div class="rate">
                            ${generateStars(rating)}
                        </div>
                        <p>Auteur: ${author}</p>
                        <p>Publié par: ${publisher}</p>
                    </div>
                </section>
                <div class="infos">
                    <div class="pages">
                        <p>${pageCount} pages</p>
                        <div class="yellowbar"></div>
                    </div>
                    <p>+100</p>
                    <p>Reviews</p>
                </div>
            `;

            const bookResumeHTML = `
                <div class="texteresume">
                    <p>${description}</p>
                </div>
            `;

            const reviewRateHTML = `
                <div class="review__rate">
                    ${generateStars(rating)}
                </div>
            `;

            bookDetails.innerHTML = bookDetailHTML;
            bookResume.innerHTML = bookResumeHTML;
            Array.from(reviewStars).forEach(starDiv => {
                starDiv.innerHTML = reviewRateHTML;
            });
        })
        .catch(error => console.error('Error fetching book details:', error));
} else {
    bookDetails.innerHTML = "<p>Pas d'id dans l'url</p>";
}

// Fonction pour générer les étoiles de notation
function generateStars(rating) {
    let starsHTML = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= Math.floor(rating)) {
            starsHTML += `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" /></svg>`;
        } else {
            starsHTML += `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" fill="#ccc"><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" /></svg>`;
        }
    }
    return starsHTML;
}