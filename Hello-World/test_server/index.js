var express = require('express');
var app = express();
var port = 8080;
var cors = require('cors');
app.use(cors());
var jsonData = {
	"hello from the backend": "Hi dummy"
};

app.get('/search', (req, res) => res.json(jsonData));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
