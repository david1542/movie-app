
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const request = require('request');
const config = require('./config');
const utils = require('./utils');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');

// Index page
app.get('/', function(req, res) {
    res.render('index');
});

app.get('/results', function(req, res) {
    const query = req.query.term;
    request.get('http://localhost:3000/search?term=' + query, function(error, response, body) {
        if(error || response.statusCode !== 200) {
            res.json({
                error: response.statusCode,
                message: 'Something went wrong'
            })
        } else {
            const data = JSON.parse(body);
            res.render('results', {movies: data.movies, query});
        }
    });
});

// Search terms
app.get('/search', function(req, res) {
    const query = req.query.term;
    request.get(config.OMDB_ROOT + 'search/movie?query=' + query + '&api_key=' + config.API_KEY, function(error, response, body) {
        if(error || response.statusCode !== 200) {
            res.json({
                error: response.statusCode,
                message: 'Something went wrong'
            })
        } else {
            const data = JSON.parse(body);
            const results = data.results.map(function(movie){
                const newMovie = Object.assign({}, movie);
                newMovie.poster = utils.composeImageUrl(newMovie.poster_path, '200');

                return newMovie;
            })

            res.json({movies: results, query});
        }
    });
});


// Show one movie item
app.get('/:id', function(req, res) {
    const movieId = req.params.id;
    request.get(config.OMDB_ROOT + 'movie/' + movieId + '?api_key=' + config.API_KEY, function(error, response, body) {
        if(error || response.statusCode !== 200) {
            res.json({
                error: response.statusCode,
                message: 'Something went wrong'
            })
        } else {
            const data = JSON.parse(body);
            const newMovie = Object.assign({}, data);
            newMovie.poster = utils.composeImageUrl(newMovie.poster_path, '300');
            
            // res.render('movie', {movie: newMovie});
            request.get(config.OMDB_ROOT + 'movie/' + newMovie.id + '/videos?api_key=' + config.API_KEY, function(error, response, body) {
                if(error || response.statusCode !== 200){
                    res.json({
                        error: response.statusCode,
                        message: 'Something went wrong'
                    })
                } else {
                    const data = JSON.parse(body);
                    let trailer = data.results[0];

                    data.results.forEach(function(item) {
                        if(item.size >= trailer.size && item.type === 'Trailer'){
                            trailer = item;
                        }
                    });

                    const movieWithTrailer = Object.assign({}, newMovie);
                    movieWithTrailer.trailer = config.YOUTUBE + trailer.key;

                    res.render('movie', {movie: movieWithTrailer});
                }
            });
        }
    });
});
app.listen(3000, function(err) {
    console.log('Server is listening on port ' + 3000);
});

// git commands
// git add .
// git commit -m "Message"
// git push origin master
