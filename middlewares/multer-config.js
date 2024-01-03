const multer = require('multer');

const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const maxFileSize = 5 * 1024 * 1024; // 5 Mo

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');
    const extension = allowedMimeTypes.includes(file.mimetype) ? file.mimetype.split('/')[1] : null;

    if (extension) {
      callback(null, name + Date.now() + '.' + extension);
    } else {
      callback(new Error('Invalid file type'), null);
    }
  }
});

const fileFilter = (req, file, callback) => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    callback(null, true);
  } else {
    callback(null, false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: maxFileSize }
}).single('image');

module.exports = upload;