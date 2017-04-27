const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const youtubedl = require('youtube-dl');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.listen(process.env.PORT || 2000, () => {
	console.log('Server started.');
	//console.log("Express server listening on port %d in %s mode", address().port, app.settings.env);
});

app.get('/', (req, res) => {
	res.json({
		'audio': '/audio/id=value',
		'video': '/video/id=value'
	});
});

app.get('/video/:id', (req, res) => {
	try {
		const id = req.params.id.split('=')[1];
		const url = "https://www.youtube.com/watch?v=" + id.toString();
		youtubedl.getInfo(url, [], { maxBuffer: 1000 * 1024 }, (e, i) => {
			if (e)
				res.json({ message: e, error: true });
			else
				res.json({ message: i, error: false });
		});
	} catch (e) {
		res.json({ message: 'Something went wrong.', error: true })
	}
});

app.get('/audio/:id', (req, res) => {
	try {
		const id = req.params.id.split('=')[1];
		const url = "https://www.youtube.com/watch?v=" + id.toString();
		youtubedl.getInfo(url, [], { maxBuffer: 1000 * 1024 }, (e, i) => {
			if (e)
				res.json({ message: e, error: true });
			else {
				const audios = i.formats.filter((xx) => xx.format_note != undefined && xx.format_note.includes('audio'))
				res.json({ message: audios, error: false });
			}
		});
	} catch (e) {
		res.json({ message: 'Something went wrong.', error: true })
	}
});