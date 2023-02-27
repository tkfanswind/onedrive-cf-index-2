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
  refresh_token: '0.AXEASF5KXcEPTkyqgnaD3GGvzbJ3TsrdEAJPnokwguIsbIVxAPU.AgABAAEAAAD--DLA3VO7QrddgJg7WevrAgDs_wUA9P-09JA10owTgsrbGRM6qg6qgF5tYNLAzYUt6g5bMrXngj3YccdMEesmpoygeOkM6pF6J68lahgjMckBhcDKWCWjHdwiy4JgmN5dfX8K5O-CTF2_mIOfgQGrxgC66-FH-6Y7fHfoJk95unyflxsWxLeYpQ-Gn70J87L_9V5odVxw0Yow24ULKcoxfaTicsCw6kuSbt7mfpbBADPM-bg6BJcT9XfzaHd35WfIt1lS5UczMkGv2cSGYS5WADFA3hNEpuIGuhuuSJiwQu5FniQUz7uX6GrYsaeZVlCNrL1qzADY_XcIk9OWxga64RNAdaUajYMo6EGNZWATa63SMODtOOTx4HLnVsoP6giLx0Fa_oD0m_g5k8UKCbvkHh68ckmXMRs2-SGeoXn7a_SsN8c_u9HKAump6Nxm60nzhlXyM4T_0POLhtWoTAVBDqXfIbhG1jO6saRr85QloJGA61ivXzVlIYrs2Bw-P0NUL9GHMmlYRrgVGKX9SXSwLX3mNY8rTv6SgPhLDUBDe_pQ_Xx3MEyXZzped9s9CCV41s7xCrqcPnxLbMbeeGsyybIhUlgwLSl93e_a6Wby_SeTpF-iB0-L5n-qBCMJI_9UQfsDZ8l0zU9abH7Dk_JSE2kUM-3STZczWPkmwTJE2MZbW7rFT6iuhBaG6Bl6c6QH048EY105N9Y8WTt07aJqqcQxFDFuEccLmjWxP6EiXndkxsHiYYoWZMqRuEeDoa6eYxUiVRY',
  client_id: 'ca4e77b2-10dd-4f02-9e89-3082e22c6c85',
  client_secret: 'Cs27Q~pi87eUyD5lgPMedQNW.cTnUHHmy_jUu',
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
