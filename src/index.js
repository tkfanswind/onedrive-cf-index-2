import config from './config/default'
import { AUTH_ENABLED, NAME, PASS } from './auth/config'
import { parseAuthHeader, unauthorizedResponse } from './auth/credentials'
import { getAccessToken } from './auth/onedrive'
import { handleFile, handleUpload } from './files/load'
import { renderFolderIndex } from './render/folderIndex'

addEventListener('fetch', event => {
  event.respondWith(handle(event.request))
})

async function handle(request) {
  if (AUTH_ENABLED === false) {
    return handleRequest(request)
  } else if (AUTH_ENABLED === true) {
    const credentials = parseAuthHeader(request.headers.get('Authorization'))
    if (!credentials || credentials.name !== NAME || credentials.pass !== PASS) {
      return unauthorizedResponse('Unauthorized')
    } else {
      return handleRequest(request)
    }
  } else {
    console.info('Auth error unexpected.')
  }
}

/**
 * Cloudflare cache instance
 */
const cache = caches.default

function wrapPathName(pathname) {
  pathname = config.base + (pathname === '/' ? '' : pathname)
  return pathname === '/' || pathname === '' ? '' : ':' + pathname
}

async function handleRequest(request) {
  if (config.cache && config.cache.enable) {
    const maybeResponse = await cache.match(request)
    if (maybeResponse) return maybeResponse
  }

  const base = config.base
  const accessToken = await getAccessToken()

  const { pathname, searchParams } = new URL(request.url)

  const thumbnail = config.thumbnail ? searchParams.get('thumbnail') : false
  const proxied = config.proxyDownload ? searchParams.get('proxied') !== null : false

  if (thumbnail) {
    const url = `https://graph.microsoft.com/v1.0/me/drive/root:${base +
      (pathname === '/' ? '' : pathname)}:/thumbnails/0/${thumbnail}/content`
    const resp = await fetch(url, {
      headers: {
        Authorization: `bearer ${accessToken}`
      }
    })

    return await handleFile(request, pathname, resp.url, {
      proxied
    })
  }

  const url = `https://graph.microsoft.com/v1.0/me/drive/root${wrapPathName(
    pathname
  )}?select=name,eTag,size,id,folder,file,%40microsoft.graph.downloadUrl&expand=children(select%3Dname,eTag,size,id,folder,file)`
  const resp = await fetch(url, {
    headers: {
      Authorization: `bearer ${accessToken}`
    }
  })
  let error = null
  if (resp.ok) {
    const data = await resp.json()
    if ('file' in data) {
      return await handleFile(request, pathname, data['@microsoft.graph.downloadUrl'], {
        proxied,
        fileSize: data.size
      })
    } else if ('folder' in data) {
      if (config.upload && request.method === 'POST') {
        const filename = searchParams.get('upload')
        const key = searchParams.get('key')
        if (filename && key && config.upload.key === key) {
          return await handleUpload(request, pathname, filename)
        } else {
          // eslint-disable-next-line no-undef
          return new Response(body, {
            status: 400
          })
        }
      }
      if (!request.url.endsWith('/')) {
        return Response.redirect(request.url + '/', 302)
      }
      return new Response(renderFolderIndex(data.children, pathname === '/', pathname), {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'content-type': 'text/html'
        }
      })
    } else {
      error = `unknown data ${JSON.stringify(data)}`
    }
  } else {
    error = (await resp.json()).error
  }

  if (error) {
    const body = JSON.stringify(error)
    switch (error.code) {
      case 'ItemNotFound':
        return new Response(body, {
          status: 404,
          headers: {
            'content-type': 'application/json'
          }
        })
      default:
        return new Response(body, {
          status: 500,
          headers: {
            'content-type': 'application/json'
          }
        })
    }
  }
}