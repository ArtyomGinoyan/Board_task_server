const uploadFileMiddleware = require('../middlewares/upload');
const fs = require('fs');
const db = require('../models');

const { file: File } = db;

const upload = async (req, res) => {
	try {
		const dirPath = `${__basedir}/resources/static/assets/uploads/card${req.params.id}`;
		if (!fs.existsSync(dirPath)) {
			fs.mkdirSync(dirPath);
		}
		if (fs.existsSync(dirPath)) {
			console.log('Folder exists');
		} else {
			console.log('Folder does not exist');
		}
		const latestID = await File.max('id');
		if (!latestID) {
			req.latestID = 1;
		}
		req.latestID = latestID + 1;
		await uploadFileMiddleware(req, res);

		if (req.file == undefined) {
			return res.status(400).send({ message: 'Please upload a file!' });
		}
		await File.create({
			file_name: `${latestID}_${req.file.originalname}`,
			cardId: req.params.id,
		});
		res.status(200).send({
			message: `Uploaded the file successfully: ${req.latestID}_${req.file.originalname}`,
		});
	} catch (err) {
		if (err.code == 'LIMIT_FILE_SIZE') {
			return res.status(500).send({
				message: 'File size cannot be larger than 2MB!',
			});
		}

		res.status(500).send({
			message: `Could not upload the file: ${req.file.originalname}. ${err}`,
		});
	}
};

const getListFiles = async (req, res) => {
	try {
		const files = await File.findAll({
			where: {
				cardId: req.params.id,
			},
		});

		if (!files) {
			return res.status(500).send({
				message: 'Unable to find files!',
			});
		}
		res.status(200).send(files);
	} catch (error) {
		console.log(error);
	}
};

const download = (req, res) => {
	try {
		const fileName = req.params.name;
		console.log(req.params.name, 'dddddddddddddddddddddddddddddddddddddddddddddddd');
		const dirPath = `${__basedir}/resources/static/assets/uploads/card${req.params.id}/`;
		if (fs.existsSync(dirPath+fileName)) {
			console.log('file exists');
		} else {
			console.log('file does not exist');
		}
		res.download(dirPath + fileName, fileName, (err) => {
			if (err) {
				res.status(500).send({
					message: 'Could not download the file. ' + err,
				});
			}
		});
	} catch (error) {
		console.log(error);
	}
};

const remove = (req, res) => {
	try {
		const { name, cardId, id } = req.params;
		const dirPath = `${__basedir}/resources/static/assets/uploads/card${cardId}/`;

		fs.unlink(dirPath + name, async (err) => {
			if (err) {
				res.status(500).send({
					message: 'Could not delete the file. ' + err,
				});
			}
			await File.destroy({
				where: {
					id: id,
				},
			});

			res.status(200).send({
				message: 'File is deleted.',
			});
		});
	} catch (error) {
		console.log(error);
	}
};

module.exports = {
	upload,
	getListFiles,
	download,
	remove,
};
