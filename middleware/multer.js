const multer = require('multer');
const path = require('path');

// Set up storage engine
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/');
    },
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}_${path.extname(file.originalname)}`);
//   },
});

// Initialize upload
const upload = multer({ storage });

module.exports = upload;
