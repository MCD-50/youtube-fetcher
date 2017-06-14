const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const youtubedl = require('youtube-dl');
const request = require('request');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.listen(process.env.PORT || 2000, () => {
	console.log('Server started.');
});

app.get('/', (req, res) => {
	res.json({
		'audio': 'https://youtube-fetcher.herokuapp.com/audio/id=value',
		'video': 'https://youtube-fetcher.herokuapp.com/video/id=value'
	});
});

app.get('/video/:id', (req, res) => {
	try {
		const id = req.params.id.split('=')[1];
		const url = "https://www.youtube.com/watch?v=" + id.toString();
		//['--format=18'], { cwd: __dirname, maxBuffer: 1000*1024 }
		youtubedl.getInfo(url, ['--format=18'], { cwd: __dirname, maxBuffer: 1000 * 1024 }, (e, i) => {
			if (e)
				res.json({ message: e, error: true });
			else{
				const videos = i.formats.filter((xx) => xx.format_note != undefined && !xx.format_note.includes('audio') && xx.ext.includes('mp4'))
				res.json({ message: videos, error: false });
			}
		});
	} catch (e) {
		res.json({ message: 'Something went wrong.', error: true })
	}
});

app.get('/audio/:id', (req, res) => {
	try {
		const id = req.params.id.split('=')[1];
		const url = "https://www.youtube.com/watch?v=" + id.toString();
		youtubedl.getInfo(url, ['--format=18'], { cwd: __dirname, maxBuffer: 1000 * 1024 }, (e, i) => {
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

app.get('/sample/:artist', (req, res)=>{
	try {
		const id = req.params.artist.split('=')[1];
		const url = `http://api.deezer.com/search?q=${id}&index=1&limit=10`
		request(url, (e, r)=>{
			if(r){
				console.log(r);
			}else{
				console.log(e);
			}
		})
	} catch (e) {
		res.json({ message: 'Something went wrong.', error: true })
	}
  }); 