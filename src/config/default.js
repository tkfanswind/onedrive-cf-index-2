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
  refresh_token: '0.AVEAt1FBlq8slkKXiKcl8cmk9E42GU3X8qVEgkhKk3PNeClRAM0.AgABAAAAAAD--DLA3VO7QrddgJg7WevrAgDs_wQA9P_sMRbuT0xIASPNQTzqpbYV-jaj58rV71NwmL5YG46jUiMxjWzLUGIwdjAnSK29Bm-k-ei4YtJZlTsyh0Rn8A8mDRLnwWMug102oYQX_YBXzYCVmmoJA43MEhS1N6JTSJL4aeUfu4t7wTopBN2ldisAST6fg2fcVGZOWD7k3VE4rLk0TiT3cI2IMnZSweI21ADc0Hm8HTEstMEMsTXVrTIGoU3o1uJTm-uikTRoRaDw5Kpa5uXRFs-nFO9ccgl7-fkHgvOkk6OtTCIp_QFa1MTFtQxe1IRGUHgDglmoCxHlxBTMnuAGr484UoNVpcq_UA8HXbV2Iosm8N9z00WRT10PT2W5yJoPDAz_oSrHzGPKlOVjpdsrBSk4UXJQmwxzKQCUOnhN9OvmWPpNGN-d5DGesRlRhM7wXPD_uWPVpY15KntE6_Un-JelnZnJWCQt4jrL2ZVsBrd_CRn0lKxqvWvRIQZf37F7OxXUr-pNZqG8YO1w-r2X3kNqtzdQNMceeSOcXTOSlYNZNtoIovCt5J35XpI2--IXON_D3LrLOB4S046qAOm72cOxpNF1KOUhgJ1TFR_m_ICn36mq6EzIuKQZBly09LAl_aS--O1Y0mXFENhyADkn5aQh2R-A0Mnx09kUw37hQ8Dfltc7Xx3oLXoXf7iIxioaflNoc7AS-6Ek3yd7H9fKcfI-EVjdYH18RZmHt1eSq8d_c5WtGQKqmX8vjDW5g66xggN_MTKX7_j7bLzThc5fcUjFD5CSPBTXkwprMWg5Ftg87u4Q5r57DT61dRwJr2C1TlRk6lOJAnTtgOqeWzQTXbS5GmHWGA4GvO3Q3pYYGpXaczCK_7Ff9FZ7YQXPb3pFpCt3itaazj0pRYrRJO1yFS3u5qAXqoq_IGm1G7ajFIEqAxVatXWwvnRKcOGIZA',
  client_id: '4d19364e-f2d7-44a5-8248-4a9373cd7829',
  client_secret: '9HQ7Q~i~uq2m_nGbs67PeqI~dUBtOa-wgORx3',
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
