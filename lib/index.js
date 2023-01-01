'use strict';

const localUpload = require('@strapi/provider-upload-local');
const fs = require('fs');
const path = require('path');
const UPLOADS_FOLDER_NAME = 'uploads';
const baseUrl = strapi.config.get('server.url');

module.exports = {
  init(config) {
    const uploadPath = path.resolve(strapi.dirs.static.public, UPLOADS_FOLDER_NAME);

    const getConfigs = async () =>
    {
      let pluginStore = strapi.store({
        environment: strapi.config.environment,
        type: 'plugin',
        name: 'cloudimage'
      });

      let configs = await pluginStore.get({key:'options'});

      return configs;
    }

    const constructCloudimageUrl = (file, url, configs) =>
    {
      const makeUrl = async () => {
        let ciUrl = `https://${configs.domain}${configs.isV7 ? '/v7' : ''}/${url.replace(/^https?:\/\//, '')}`;
        file.url = ciUrl;
      }

      return makeUrl();
    }

    return {
      async uploadStream(file) 
      {
        let cloudimageConfigs = await getConfigs();

        if (!cloudimageConfigs) 
        {
          return localUpload.init().uploadStream(file);
        }

        let imageUniqueName = `${file.hash}${file.ext}`;
        let imagePath = path.join(uploadPath, imageUniqueName);
        let base64 = fs.readFileSync((file.stream.path), {encoding: 'base64'});
        let data = base64.replace(/^data:image\/\w+;base64,/, "");
        let buffer = Buffer.from(data, 'base64');
        fs.writeFileSync(imagePath, buffer);
        let imageUrl = `${baseUrl}/uploads/${imageUniqueName}`;

        return constructCloudimageUrl(file, imageUrl, cloudimageConfigs);
      },
      async upload(file) 
      {
        let cloudimageConfigs = await getConfigs();

        if (!cloudimageConfigs) 
        {
          return localUpload.init().upload(file);
        }

        let imageUniqueName = `${file.hash}${file.ext}`;
        let imagePath = path.join(uploadPath, imageUniqueName);
        fs.writeFileSync(imagePath, file.buffer);
        let imageUrl = `${baseUrl}/uploads/${imageUniqueName}`;

        return constructCloudimageUrl(file, imageUrl, cloudimageConfigs);
      },
      async delete(file) 
      {
        return localUpload.init().delete(file);
      },
    };
  },
};
