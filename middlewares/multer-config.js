const multer = require('multer');
const multerS3 = require('multer-s3');
const s3 = require('../config/aws-config');
const { S3 } = require('@aws-sdk/client-s3');
require('dotenv').config();

const upload = multer({
  storage: multerS3({
    s3: new S3({ client: s3 }),
    bucket: process.env.S3_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString() + '-' + file.originalname);
    }
  })
});

module.exports = upload;
