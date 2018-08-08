document.getElementById('movieTerm').addEventListener('input', function(e) {
    const query = e.target.value;

    document.querySelector('#search-bar > h3').innerText = 'Results for term: ' + query;
    const request = fetch('/search?term=' + query);

    fetch('/search?term=' + query).then(function(res) {
        if(res.ok) {
            return res.json();
        } else {
            throw new Error({
                status: res.status,
                message: 'Error'
            })
        }
    }).then(function(data) {
        const movieList = document.querySelector('.movie-list');
        movieList.innerHTML = '';

        const movies = data.movies;
        movies.forEach(function(movie) {
            // Create movie container
           const cardBody = document.createElement('div');
           cardBody.classList = 'card-body';

            // Create movie img tag
           const movieImg = document.createElement('img');
           movieImg.src = movie.poster;
           movieImg.onerror = function() {
                movieImg.error = null;
                movieImg.src='images/default.jpg';
           }
           movieImg.classList = 'movie-img'

            // Create details container
           const detailsContainer = document.createElement('div');
           detailsContainer.classList = 'h-100 w-100 movie-body';

            // Movie title
           const title = document.createElement('h4');
           title.classList = 'movie-title text-white';
           title.innerText = movie.title;

            // Movie release date
           const date = document.createElement('h4');
           date.classList = 'movie-text text-white';
           date.innerText = movie.release_date;

            // Explore more button           
           const link = document.createElement('a');
           link.classList = 'btn btn-danger explore';
           link.href = '/' + movie.id;
           link.innerText = 'Explore More!';

            // Appendings
           detailsContainer.appendChild(title);
           detailsContainer.appendChild(date);
           detailsContainer.appendChild(link);

            // Append all childs to the main container
           cardBody.appendChild(movieImg);
           cardBody.appendChild(detailsContainer);

           movieList.appendChild(cardBody);
        });
    }).catch(function(err) {
        console.log(err);
    });
});

