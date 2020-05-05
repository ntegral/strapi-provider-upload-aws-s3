"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const S3 = require("aws-sdk/clients/s3");
const AWS = require("aws-sdk");
module.exports = {
    init(config) {
        AWS.config.update({
            apiVersion: '2006-03-01',
            accessKeyId: config.accessKeyId,
            secretAccessKey: config.secretAccessKey,
            region: config.region,
        });
        const client = new S3({
            params: {
                Bucket: config.params.Bucket
            }
        });
        return {
            upload(file, customParams = {}) {
                return new Promise((resolve, reject) => {
                    const path = file.path ? `${file.path}/` : "";
                    client.upload({
                        Key: `${path}${file.hash}${file.ext}`,
                        Bucket: config.params.Bucket,
                        Body: new Buffer(file.buffer, "binary"),
                        StorageClass: 'STANDARD',
                        ACL: 'public-read',
                        ContentType: file.mime,
                    }, ((err, data) => {
                        if (err) {
                            return reject(err);
                        }
                        file.url = data.Location;
                        resolve();
                    }));
                });
            },
            delete(file, customParams = {}) {
                return new Promise((resolve, reject) => {
                    const path = file.path ? `${file.path}/` : "";
                    client.deleteObject({
                        Key: `${path}${file.hash}${file.ext}`,
                        Bucket: config.params.Bucket
                    }, (err, data) => {
                        if (err) {
                            return reject(err);
                        }
                        resolve();
                    });
                });
            }
        };
    }
};
