const config = require('./config');

module.exports.composeImageUrl = function(path, width){
    return config.MOVIE_IMG_ROOT + 'w' + width + '/' + path;
}