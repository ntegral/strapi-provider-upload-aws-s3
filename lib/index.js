"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const S3 = require("aws-sdk/clients/s3");
module.exports = {
    init(config) {
        console.log('config:', config);
        const client = new S3({
            apiVersion: '2006-03-01',
            accessKeyId: config.accessKeyId,
            secretAccessKey: config.secretAccessKey,
            region: config.region,
            params: {
                Bucket: config.params.Bucket
            }
        });
        return {
            upload(file, customParams = {}) {
                console.log('upload:what are customParams', customParams);
                return new Promise((resolve, reject) => {
                    const path = file.path ? `${file.path}/` : "";
                    client.upload({
                        Key: `${path}${file.hash}${file.ext}`,
                        Bucket: config.params.Bucket
                    }, ((err, data) => {
                        if (err) {
                            return reject(err);
                        }
                        console.log('upload send data:', data);
                        file.url = data.Location;
                        resolve();
                    }));
                });
            },
            delete(file, customParams = {}) {
                console.log('delete:what are customParams', customParams);
                return new Promise((resolve, reject) => {
                    const path = file.path ? `${file.path}/` : "";
                    client.deleteObject({
                        Key: `${path}${file.hash}${file.ext}`,
                        Bucket: config.params.Bucket
                    }, (err, data) => {
                        if (err) {
                            return reject(err);
                        }
                        console.log('delete object data:', data);
                        resolve();
                    });
                });
            }
        };
    }
};
