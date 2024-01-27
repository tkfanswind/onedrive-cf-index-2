/* eslint-disable no-irregular-whitespace */
const config = {
  /**
   * Configure the account/resource type for deployment (with 0 or 1)
   * - accountType: controls account type, 0 for global, 1 for china (21Vianet)
   * - driveType: controls drive resource type, 0 for onedrive, 1 for sharepoint document
   *
   * Followed keys is used for sharepoint resource, change them only if you gonna use sharepoint
   * - hostName: sharepoint site hostname (like 'name.sharepoint.com')
   * - sitePath: sharepoint site path (like '/sites/name')
   * !Note: we do not support deploying onedrive & sharepoint at the same time
   */
  type: {
    accountType: 0,
    driveType: 0,
    hostName: null,
    sitePath: null
  },

  /**
   * You can use this tool http://heymind.github.io/tools/microsoft-graph-api-auth
   * to get following params: client_id, client_secret, refresh_token & redirect_uri.
   */
  refresh_token: '0.AVYA3V1Iugst5UuU1onmg0s9QjBUarPI1UlCqHkfCDf6fQufAJ8.AgABAAEAAAAmoFfGtYxvRrNriQdPKIZ-AgDs_wUA9P8a3VpzlTvQLNamlCl0hvoBrSSthD84-IsUlQhbodqpxiLD_-YvowA8lqto4Z0FRPi_R4djipDI3DKkcoqxFSxFcxADp5gyEYmXU439lnU0VRlvjxque9pIcgcfVzzJP1O11qbWvcO7ElaZvtryXcyZCoKiIIQ0Q2uj9yVg9FgrFzj07yZpNVffzdg0MQtnmoJcg3IB8-af-NSHUNp3wvwzhbWhfQ0gYcXj_jaZTneSOiwnLYTV9dwJHRsOUvfd9vL5UGGkGcVJPh8mPj6qhA_RcK9gkgVWXjgGqIXSPvS83HRGtZ6OWOBKIAzwxMAs93DNGLkemhjz1hVSzoBcszUX-5gO1uZejz-SBudDqagvpKHXO0ICBYGH5jWpmXjFubfJ2Jn_S8YlMilW6LW33bV5azvyNR1UBDquyZpuJhIyuEitnFeGfq-hVepvbQm7id7E3SSu_PTWiT3WOvY5s-w5I9sEZc_PKBcmlv08fcVQdTckXRUensQmwTw2HewsCuHUSdm1KDmotIHyagUWq6QiwELPc0oWNLRyeHWaSh9K7jt7EejGHoeOuhOqaOcFK_oWaYzw5g0dHronslljnkiyYYAkVc4EEA5jZBB2gbteLMyVd8lhU26bW5fp7uFw72jMa9xFpF2QBOcSOxspL2Gx_qAFQ1_ZJwXv_A8451vXJ63LPDJ5a_rypFALOG3KmrIZFaXZorkHiWilzBmi4A',
  client_id: 'b36a5430-d5c8-4249-a879-1f0837fa7d0b',
  client_secret: 'gX08Q~0xXqLZnKoo6g4YKG3NclS1jN0t2wZo-cfx',
  redirect_uri: 'https://heymind.github.io/tools/microsoft-graph-api-auth',

  /**
   * The base path for indexing, all files and subfolders are public by this tool. For example: `/Public`.
   */
  base: '/Public',

  /**
   * Feature: Pagination when a folder has multiple(>${top}) files
   * - top: specify the page size limit of the result set, a big `top` value will slow down the fetching speed
   */
  pagination: {
    enable: true,
    top: 100 // default: 200, accepts a minimum value of 1 and a maximum value of 999 (inclusive)
  },

  /**
   * Feature Caching
   * Enable Cloudflare cache for path pattern listed below.
   * Cache rules:
   * - Entire File Cache  0 < file_size < entireFileCacheLimit
   * - Chunked Cache     entireFileCacheLimit  <= file_size < chunkedCacheLimit
   * - No Cache ( redirect to OneDrive Server )   others
   *
   * Difference between `Entire File Cache` and `Chunked Cache`
   *
   * `Entire File Cache` requires the entire file to be transferred to the Cloudflare server before
   *  the first byte sent to a client.
   *
   * `Chunked Cache` would stream the file content to the client while caching it.
   *  But there is no exact Content-Length in the response headers. ( Content-Length: chunked )
   *
   * `previewCache`: using CloudFlare cache to preview
   */
  cache: {
    enable: true,
    entireFileCacheLimit: 10000000, // 10MB
    chunkedCacheLimit: 100000000, // 100MB
    previewCache: false,
    paths: ['/🥟%20Some%20test%20files/Previews']
  },

  /**
   * Feature: Thumbnail
   * Show a thumbnail of image by ?thumbnail=small (small, medium, large)
   * More details: https://docs.microsoft.com/en-us/onedrive/developer/rest-api/api/driveitem_list_thumbnails?view=odsp-graph-online#size-options
   * Example: https://storage.spencerwoo.com/🥟%20Some%20test%20files/Previews/eb37c02438f.png?thumbnail=mediumSquare
   * You can embed this link (url encoded) directly inside Markdown or HTML.
   */
  thumbnail: true,

  /**
   * Small File Upload (<= 4MB)
   * POST https://<base_url>/<directory_path>/?upload=<filename>&key=<secret_key>
   * The <secret_key> is defined by you
   */
  upload: {
    enable: false,
    key: 'your_secret_key_here'
  },

  /**
   * Feature: Proxy Download
   * Use Cloudflare as a relay to speed up download. (Especially in Mainland China)
   * Example: https://storage.spencerwoo.com/🥟%20Some%20test%20files/Previews/eb37c02438f.png?raw&proxied
   * You can also embed this link (url encoded) directly inside Markdown or HTML.
   */
  proxyDownload: true
}

// IIFE to set apiEndpoint & baseResource
// eslint-disable-next-line no-unused-expressions
!(function({ accountType, driveType, hostName, sitePath }) {
  config.apiEndpoint = {
    graph: accountType ? 'https://microsoftgraph.chinacloudapi.cn/v1.0' : 'https://graph.microsoft.com/v1.0',
    auth: accountType
      ? 'https://login.chinacloudapi.cn/common/oauth2/v2.0'
      : 'https://login.microsoftonline.com/common/oauth2/v2.0'
  }
  config.baseResource = driveType ? `/sites/${hostName}:${sitePath}` : '/me/drive'
})(config.type)

export default config
