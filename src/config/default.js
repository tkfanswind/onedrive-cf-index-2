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
  refresh_token: '0.AXEASF5KXcEPTkyqgnaD3GGvze4O3nSkETRHnVMPuEnUO-xxAHA.AgABAAAAAAD--DLA3VO7QrddgJg7WevrAgDs_wQA9P9TkWCnTZqJG9ETo6uRTSKuT_ht18W1rRWYb1LyJdiDK56nQD8eNPJ1jcXBJY_7tOi4NkpHQWOCQ3W3s1GecHNuOPIHo8JwPjyQ3Dz_VPhmVEvi89JavNxevaNyoocRjwH8tlfPya3EvUnTejkR2v49cLxlxkE1CX1SjwucJ6SA-BhaSoJ02CaGsHsKTuydTi1nWrABE86FzsetElyl4y9q0JyH0TXJMGNNY8S7n65BCJ-UqweHORQX_jNA-lDwDcGOJBrBvKxyKdycT155quyzGdUQnGAkBdLfLCByl6JsGZXmqOpSLLTZtZ53G7e-F3YXuw0tTSpCw-iMNp6OSd52H79KEwrMk7dA9ec-PvBH8L2qwHT3z9xRn4mFmuRV_Lu7jOoNBkgaPeTKddyuJMP4UC7Jd3sYy6kZ8xPdSPMeuzmyuplAlAscqVavVG-Lb9KoON8LWOVbl_z3vLNFwkaCw2dTaV0Z9cOACLP3eR9PvbxO2uoOqmBJR4r8sRb870F7yTG033gkJSDF1k02r7jjN9FRbZLGLogX80UiSs-6_AQWeRCnij37PIIAolgfTiFjEPeryH9_3FXOBjKOaYobR3XEWfFlFJJ3itzuH9nXcQVAbUHoLDgXP0uOOCYHDhwWn7whfoSYpJzqfY-TLfmmAvw86ZXjMs09B8u4_YKATUyl97jsGtIly8on26O6M8K_-i6dbq-KUti8F-pUiirYKLZOGBa94TyWqi9bFIcYrRTxHH151mqDGAwnlMi4rXvZeaZ6CWZfj4zBnnjaXsEZHlhQZUf6lrReKUtsg2FpZO3_4gzgxVV3KspctBAd4KnZq82ym9fdKa_tM3lyoOWqtqXdFveipky-6cljv1C48LpEt8b0QVOSs4koxSGlVtaoCsiTVkcKiI8qjmCzp5IeBrv9P-ns7SUwfZiOU0N_',
  client_id: '74de0eee-11a4-4734-9d53-0fb849d43bec',
  client_secret: 'P_kF6qVpMuYrbcCKTzeD.zoFD4kM2_.794',
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
