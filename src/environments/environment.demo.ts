export const environment = {

    production: true,

    api :  {
      baseUrl : '/v1/api',
      authTokenName: '__token__',
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
