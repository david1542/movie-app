const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const request = require('request');
const config = require('./config');

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
    request.get(config.OMDB_API + 's=' + query, function(error, response, body) {
        if(error || response.statusCode !== 200) {
            res.json({
                error: response.statusCode,
                message: 'Something went wrong'
            })
        } else {
            const data = JSON.parse(body);
            res.json({movies: data.Search, query});
        }
    });
});

// Show one movie item
app.get('/:id', function(req, res) {
    const movieId = req.params.id;
    request.get(config.OMDB_API + 'i=' + movieId, function(error, response, body) {
        if(error || response.statusCode !== 200) {
            res.json({
                error: response.statusCode,
                message: 'Something went wrong'
            })
        } else {
            const data = JSON.parse(body);
            res.render('movie', {movie: data});
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
