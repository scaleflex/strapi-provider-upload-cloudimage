# Cloudimage upload provider from Scaleflex for Strapi v4

## Install

`npm install provider-upload-cloudimage`

The Cloudimage Upload Provider should be installed after the Cloudimage Plugin for the Strapi CMS. Otherwise it will just upload images to the local server.

## Config

`config/plugins.js`

```
module.exports = {
  ...
  'upload': { // Add this section
    config: {
      provider: 'provider-upload-cloudimage',
      providerOptions: {},
    },
  },
};
```

`config/server.js`

Append `url: 'domain (including the http/https:// part)'`

Eg: if you website is called `mywebsite.com`, then write like this:

```
module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  app: {
    keys: env.array('APP_KEYS'),
  },
  url: 'https://www.mywebsite.com',
});
```

**It’s very important that you don’t forget to do this**

## What this upload-provider brings

Converts the images' URLs to Cloudimage URLs upon every upload (both in admin back-office and API). 

So URLs will be converted to `{Cloudimage-token}/cloudimg.io/{original-URL}`.
