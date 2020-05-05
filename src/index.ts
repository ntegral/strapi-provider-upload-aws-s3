import * as S3 from 'aws-sdk/clients/s3';
import * as AWS from 'aws-sdk';

interface File {
    path: string;
    url: string;
    hash: string;
    ext: string;
    buffer: string;
    mime: string;
}


module.exports = {

    init(config: S3.ClientConfiguration & any ) {
        AWS.config.update({
            apiVersion: '2006-03-01',
            accessKeyId: config.accessKeyId,
            secretAccessKey: config.secretAccessKey,
            region: config.region,
        });
        // console.log('config:', config);
        const client = new S3({
            params: {
                Bucket: config.params.Bucket
            }
        });

        return {
            upload(file:File, customParams = {}) {
                // console.log('upload:what are customParams', customParams);
                return new Promise((resolve, reject) => {
                    const path = file.path ? `${file.path}/` : "";

                    client.upload({
                        Key: `${path}${file.hash}${file.ext}`,
                        Bucket: config.params.Bucket,
                        Body: new Buffer(file.buffer, "binary"),
                        StorageClass: 'STANDARD',
                        ACL: 'public-read',
                        ContentType: file.mime,
                    }, ((err: Error, data: S3.ManagedUpload.SendData) => {
                        if (err) {
                            // console.log('err', err);
                            return reject(err);
                        }

                        // console.log('upload send data:', data);
                        file.url = data.Location;
                        resolve();
                    }))
                })
            },

            delete(file: File, customParams = {}) {
                // console.log('delete:what are customParams', customParams);
                return new Promise((resolve, reject) => {
                    const path = file.path ? `${file.path}/` : "";

                    client.deleteObject({
                        Key: `${path}${file.hash}${file.ext}`,
                        Bucket: config.params.Bucket
                    }, (err: Error, data: S3.DeleteObjectOutput) => {
                        if (err) {
                            return reject(err);
                        }
                        // console.log('delete object data:', data);
                        resolve();
                    })
                })
            }
        }
    }
}