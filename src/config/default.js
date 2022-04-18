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
  refresh_token: '0.AVwAOqgt15tmLEuw0FIL5YOAMhiOZJJbu4tBssFXF04eI4tcAHE.AgABAAAAAAD--DLA3VO7QrddgJg7WevrAgDs_wQA9P8lTC-6iIaW_h_jrLuiWbf4_eVadU8twMq52EhNmQWMDLuKxB8HJH_KxGKvaMGNd2MQQL6mWtXnQnjKL9jEkdfhH3Lhq-0Ci5dciIPBl4IsrdqM6OSvhIl6z6N7QlCMKl6TWzkY2NB_jnSmopnSCsDvbHq6PLoH4Or_df004nrBYy4S73mMMUS4owUkTp_U5-Dbc44lexCuq2GxRl4dy7ckY5BfPBrkZd4du1RmXpeT68gk6vCrojRIUQKvpO6XsvSoS-q0i5AyeM5xJfcJTyMzgIpcDEgNAS16nYu4f3Lx-Id7R0fX2NtyikE7c94QLylmssMNLSdL3vg1-xgtPiSGmpo_fomeOSfULFdy1d2wDmx_9shZQru9KgwLceIiqAkqt3tLYk0DVgFACxYYazWquYPVRTp6k3dcCtvCR6jKgl2u7szdYg7JI7GwMd8T7JFV9a5LTbrCMrXXn87TLrXuOOqpRAak6mbkJFtV9PouTQA9z-LTTCAGl4djAx1GjHKDCHZlS3uNAtHRSKDHJWUFE6fZkr-YavApE2jHE_JK82tPkV_VeKwCrvwfEn6h9e8e5WhREwzN0OHKnopdLCJZmOpZ-Tb-av-7RcHyoKA2pd3c1HzVyh4VKRSJ1zddOiC2uKTaVOkfk1Ql2UowYGO7YpVYL7q4r461E3LUUKuaJ07tiaj0KCisgsd7IDjzEVwJkRhmm0Y0q-y64hCrn6GUvMHkEwsU2XQrCd03amISDxLktH39jepCufHeKySMNchr96Uy6crD3U493Fh9P32KjC1p1XKL_kHsYhqwMh4TZX0CdqLu9kaG5QofkqUO9BEddF7fPP7M4fO-QnMkpT3P3Vushzk_hzjB1Ydoj3E6vApVgqwIH0CzTQb2lRPO4jvHFGCKIXYb48z5iWoqnIdnTzmwMTo',
  client_id: '92648e18-bb5b-418b-b2c1-57174e1e238b',
  client_secret: 'x2dvOF40~-kBn_oFZ-JeCCm~-bT8kRAczk',
  redirect_uri: 'https://heymind.github.io/tools/microsoft-graph-api-auth',

  /**
   * The base path for indexing, all files and subfolders are public by this tool. For example: `/Public`.
   */
  base: '/BAK/Public',

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
