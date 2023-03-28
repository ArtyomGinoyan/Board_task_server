const util = require('util');
const multer = require('multer');

const maxSize = 2 * 1024 * 1024;

let storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, `${__basedir}/resources/static/assets/uploads/${req.params.id}`);
	},
	filename: async (req, file, cb) => {
		const latestID = req.latestID;
		cb(null, `${latestID}_${file.originalname}`);
	},
});

let uploadFile = multer({
	storage: storage,
	limits: { fileSize: maxSize },
}).single('file');

let uploadFileMiddleware = util.promisify(uploadFile);
module.exports = uploadFileMiddleware;
