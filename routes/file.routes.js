const { verifyToken } = require('../middlewares/verifyToken');
const { upload, getListFiles, download, remove } = require('../controllers/file.controller');

module.exports = (app) => {
	app.use((req, res, next) => {
		res.header('Access-Control-Allow-Headers', 'x-access-token, Origin, Content-Type, Accept');
		next();
	});
	app.post('/upload', upload);
	app.get('/files', getListFiles);
	app.get('/files/:name', download);
	app.delete('/files/:name', remove);
};
