export const environment = {

    production: true,

    api :  {
      baseUrl : '/v1/api',
      authTokenName: '__token__',
      PW: 'VN0xsssDZcXlXA2FNBgl5TWHtmZkDCau',
      storageUrl : '/storage'
    },
    local: {
      baseUrl: 'http://localhost/v1/api',
    },
    repository: {
      baseUrl: '/s3/prep/',
    },

    isDemo: true,
    defaultLandingUrl:"/app"

};
