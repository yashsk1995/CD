/**
 * Created by zeeshan on 3/1/2017.
 */

module.exports = {

  uploadToS3: function (file, originalFilePath) {


    return new Promise(function (resolve, reject) {
      if (file) {
        file.upload({
          adapter: require('skipper-s3'),
          key: sails.config.aws.accessKeyId,
          secret: sails.config.aws.secretAccessKey,
          bucket: sails.config.aws.s3Bucket
        }, function (err, files) {
          if (err) {
            return reject(err);
          }

          if (files.length > 0) {
            var fileUrl = files[0].extra.Location;
            return resolve(fileUrl);
          } else {
            return resolve(originalFilePath);
          }
        });
      } else {
        return reject({message: 'File not Found'});
      }
    });
  },

  uploadS3Stream: function (stream, callback) {
    var AWS = require('aws-sdk');
    AWS.config.update({accessKeyId: sails.config.aws.accessKeyId, secretAccessKey: sails.config.aws.secretAccessKey});
    var s3Stream = require('s3-upload-stream')(new AWS.S3());

    var upload = s3Stream.upload({
      Bucket: sails.config.aws.s3Bucket,
      Key: 'application_' + Math.random().toString(36).slice(2) + '.pdf'
    });

    upload.on('error', function (error) {
      callback(error);
    });

    upload.on('uploaded', function (details) {
      callback(false, details.Location);
    });

    stream.pipe(upload);
  }

};
