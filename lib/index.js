'use strict';

const localUpload = require('@strapi/provider-upload-local');

module.exports = {
  init(config) {
    const getConfigs = async () =>
    {
      var pluginStore = strapi.store({
        environment: strapi.config.environment,
        type: 'plugin',
        name: 'cloudimage'
      });

      var configs = await pluginStore.get({key:'options'});

      return configs;
    }

    const constructCloudimageUrl = (file, configs) =>
    {
      const makeUrl = async () => {
        await localUpload.init().upload(file);

        var url = `https://demo.cloudimg.io/v7/www.sample.li/birds.jpg`; // Fix this later configs.ciDomain, configs.isV7, file.url.replace(/^https?:\/\//, '') 
        file.url = url;
      }

      return makeUrl();
    }

    return {
      async uploadStream(file) 
      {
        var cloudimageConfigs = await getConfigs();

        if (!cloudimageConfigs) 
        {
          return localUpload.init().upload(file);
        }

        if (file.caption)
        { // Ignore Strapi CMS's size variations
          return constructCloudimageUrl(file, cloudimageConfigs);
        }
      },
      async upload(file) 
      {
        var cloudimageConfigs = await getConfigs();

        if (!cloudimageConfigs) 
        {
          return localUpload.init().upload(file);
        }

        if (file.caption)
        { // Ignore Strapi CMS's size variations
          return constructCloudimageUrl(file, cloudimageConfigs);
        }
      },
      async delete(file) 
      {
        if (file.id)
        { // Ignore Strapi CMS's size variations
          return localUpload.init().delete(file);
        }
      },
    };
  },
};
