document.getElementById('movieTerm').addEventListener('input', function(e) {
    const query = e.target.value;

    fetch('/search?term=' + query).then(function(res) {
        if(res.ok) {
            return res.json();
        } else {
            console.log('Error');
        }
    }).then(function(data) {
        console.log(data);
    }).catch(function(err) {
        console.log(err);
    });
});