import emojiRegex from 'emoji-regex/RGI_Emoji'
import { getClassNameForMimeType, getClassNameForFilename } from 'font-awesome-filetypes'

import { renderHTML } from './render/htmlWrapper'
import { renderPath } from './render/pathUtil'
import { renderMarkdown } from './render/mdRenderer'

/**
 * Convert bytes to human readable file size
 *
 * @param {Number} bytes File size in bytes
 * @param {Boolean} si 1000 - true; 1024 - false
 */
function readableFileSize(bytes, si) {
  bytes = parseInt(bytes, 10)
  var thresh = si ? 1000 : 1024
  if (Math.abs(bytes) < thresh) {
    return bytes + ' B'
  }
  var units = si
    ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']
  var u = -1
  do {
    bytes /= thresh
    ++u
  } while (Math.abs(bytes) >= thresh && u < units.length - 1)
  return bytes.toFixed(1) + ' ' + units[u]
}

/**
 * Render Folder Index
 *
 * @param {*} items
 * @param {*} isIndex don't show ".." on index page.
 */
export async function renderFolderView(items, path, request) {
  const isIndex = path === '/'

  const el = (tag, attrs, content) => `<${tag} ${attrs.join(' ')}>${content}</${tag}>`
  const div = (className, content) => el('div', [`class=${className}`], content)
  const item = (icon, fileName, fileAbsoluteUrl, size, emojiIcon) =>
    el(
      'a',
      [`href="${fileAbsoluteUrl}"`, 'class="item"', size ? `size="${size}"` : ''],
      (emojiIcon ? el('i', ['style="font-style: normal"'], emojiIcon) : el('i', [`class="${icon}"`], '')) +
      fileName +
      el('div', ['style="flex-grow: 1;"'], '') +
      (fileName === '..' ? '' : el('span', ['class="size"'], readableFileSize(size)))
    )

  const intro = `<html>
               <head>
            <meta name="referrer" content="never">
              </head>
                  <div class="intro markdown-body" style="text-align: left; margin-top: 2rem;">
                    <h2>Hi, I'm tkfans 👋</h2>
                    <p>This is Tetsuya Komuro OneDrive public directory listing.  Reach me at:  tkfanswind@gmail.com.</p>
                    <p><a href="https://tkfans.pw/">Tetsuya Komuro OneDrive</a></p>
                    <p><a href="https://avex.jp/tk/">Tetsuya Komuro Official</a></p>
                    <p><a href="http://566.music.coocan.jp/">Tetsuya Komuro WORKS</a></p>
                    
                          <hr>
                    <h2>📁 Music Playlist 👋</h2>
                    <p><a href="https://onedrive.tkfans.us/TK%20Music.html">TK Music List</a></p>
                    <p><a href="https://onedrive.tkfans.us/Tag.html">TK Music Tag</a></p>
                          <hr>   
                          
  <img src="https://storage.googleapis.com/image.fanicon.net/uploads/1625188919538_153fy6hrrp.png" width="80%">
  <img src="https://storage.googleapis.com/studio-design-asset-files/projects/rROnJDoZOA/s-2064x1377_v-frms_webp_f969e243-475a-4d58-9179-81aa3bec8d7a_middle.jpg" width="80%">
  <img src="https://m.media-amazon.com/images/I/913RrYRn+yL._AC_SL1500_.jpg" width="80%">
  <img src="https://storage.googleapis.com/image.fanicon.net/shop/1636440398077_buyq7432bt.jpg" width="80%">
  <img src="https://storage.googleapis.com/image.fanicon.net/shop/1637923523146_w1r6177lba.jpg" width="80%">
  <img src="https://avex.jp/globe/10000th/assets/img/top/img_disc_jacket.jpg" width="80%">
  <img src="https://img.imageimg.net/artist/globe/img/product_1025185.jpg" width="80%">
  <img src="https://m.media-amazon.com/images/I/51agbW9kdLL._UXNaN_FMjpg_QL85_.jpg" width="80%">
  <img src="https://i.ytimg.com/vi/0drhFgNuaWs/maxresdefault.jpg" width="80%">
  <img src="https://m.media-amazon.com/images/I/612GTi1DwqL._AC_SL1108_.jpg" width="80%">
  <img src="https://images-na.ssl-images-amazon.com/images/I/816fJCMt%2BDL._AC_SL1500_.jpg" width="80%">
  <img src="https://d3rwyinxzcqr6y.cloudfront.net/Assets/18/654/L_p0028365418.jpg" width="80%">
  <img src="https://d3rwyinxzcqr6y.cloudfront.net/Assets/65/935/L_p0092193565.jpg" width="80%">          
                  </div>
                 </html>`

  // Check if current directory contains README.md, if true, then render spinner
  let readmeExists = false
  let readmeFetchUrl = ''

  const body = div(
    'container',
    div('path', renderPath(path)) +
    div(
      'items',
      el(
        'div',
        ['style="min-width: 600px"'],
        (!isIndex ? item('far fa-folder', '..', `${path}..`) : '') +
        items
          .map(i => {
            // Check if the current item is a folder or a file
            if ('folder' in i) {
              const emoji = emojiRegex().exec(i.name)
              if (emoji && !emoji.index) {
                return item('', i.name.replace(emoji, '').trim(), `${path}${i.name}/`, i.size, emoji[0])
              } else {
                return item('far fa-folder', i.name, `${path}${i.name}/`, i.size)
              }
            } else if ('file' in i) {
              // Check if README.md exists
              if (!readmeExists) {
                // TODO: debugging for README preview rendering
                console.log(i)

                readmeExists = i.name.toLowerCase() === 'readme.md'
                readmeFetchUrl = i['@microsoft.graph.downloadUrl']
              }

              // Render file icons
              let fileIcon = getClassNameForMimeType(i.file.mimeType)
              if (fileIcon === 'fa-file') {
                // Check for files that haven't been rendered as expected
                const extension = i.name.split('.').pop()
                if (extension === 'md') {
                  fileIcon = 'fab fa-markdown'
                } else if (['7z', 'rar', 'bz2', 'xz', 'tar', 'wim'].includes(extension)) {
                  fileIcon = 'far fa-file-archive'
                } else if (['flac', 'oga', 'opus'].includes(extension)) {
                  fileIcon = 'far fa-file-audio'
                } else {
                  fileIcon = `far ${getClassNameForFilename(i.name)}`
                }
              } else {
                fileIcon = `far ${fileIcon}`
              }
              return item(fileIcon, i.name, `${path}${i.name}`, i.size)
            } else {
              console.log(`unknown item type ${i}`)
            }
          })
          .join('')
      )
    ) +
    (readmeExists && !isIndex ? await renderMarkdown(readmeFetchUrl, 'fade-in-fwd', '') : '') +
    (isIndex ? intro : '')
  )
  return renderHTML(body, ...[request.pLink, request.pIdx])
}
