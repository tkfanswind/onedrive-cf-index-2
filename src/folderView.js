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
                    <p>This is tkfans OneDrive public directory listing.  Reach me at:  tkfanswind@gmail.com.</p>
                    <p><a href="https://od.tkfans.tk/">OneDrive OLAINDEX</a></p>
                    <p><a href="https://onedrive.tkfans.tk/">OneDrive FODI</a></p>
                          <hr>
                    <h2>📁 NEW 👋</h2>
                    <p><a href="https://tkfans.tk/NEW/">NEW</a></p>
                    <p><a href="https://tkfans.tk/TV/%E5%8A%A8%E6%BC%AB/%E6%96%B0%E4%B8%96%E7%BA%AA%E7%A6%8F%E9%9F%B3%E6%88%98%E5%A3%AB/">新世纪福音战士</a></p>
                    <p><a href="https://tkfans.tk/Films/%E7%94%B5%E5%BD%B1%E5%90%88%E9%9B%86/DC%E7%94%B5%E5%BD%B1/">X特遣队：全员集结</a></p>
                    <p><a href="https://tkfans.tk/Films/%E7%94%B5%E5%BD%B1%E5%90%88%E9%9B%86/%E6%BC%AB%E5%A8%81%E7%94%B5%E5%BD%B1/[2021.07.09]%E9%BB%91%E5%AF%A1%E5%A6%87/">黑寡妇</a></p>
                    <p><a href="https://tkfans.tk/TV/USTV/Marvel%20Studios/Loki/">洛基</a></p>

                          <hr>
            <img src="https://img3.doubanio.com/view/photo/l/public/p2634037610.jpg" width="60%" height="60%">
            <img src="https://img2.doubanio.com/view/photo/l/public/p2636972051.jpg" width="60%" height="60%">
            <img src="https://img9.doubanio.com/view/photo/l/public/p2640611704.jpg" width="60%" height="60%">
            <img src="https://img9.doubanio.com/view/photo/l/public/p2652691446.jpg" width="60%" height="60%">
            <img src="https://img2.doubanio.com/view/photo/l/public/p2657554193.jpg" width="60%" height="60%">
            <img src="https://img9.doubanio.com/view/photo/l/public/p2647131304.jpg" width="60%" height="60%">
            <img src="https://img2.doubanio.com/view/photo/l/public/p2649579601.jpg" width="60%" height="60%">
            <img src="https://img2.doubanio.com/view/photo/l/public/p1422373182.jpg" width="60%" height="60%">
            <img src="https://img2.doubanio.com/view/photo/l/public/p2191442753.jpg" width="60%" height="60%">
            <img src="https://img9.doubanio.com/view/photo/l/public/p2662552995.jpg" width="60%" height="60%">
            <img src="https://img2.doubanio.com/view/photo/l/public/p2657248953.jpg" width="60%" height="60%">
            <img src="https://img2.doubanio.com/view/photo/l/public/p2670935583.jpg" width="60%" height="60%">
            <img src="https://img1.doubanio.com/view/photo/l/public/p2594097919.jpg" width="60%" height="60%">
            <img src="https://img1.doubanio.com/view/photo/l/public/p896064368.jpg" width="60%" height="60%">
            <img src="https://img2.doubanio.com/view/photo/l/public/p1579021082.jpg" width="60%" height="60%">
            <img src="https://img1.doubanio.com/view/photo/l/public/p2641350668.jpg" width="60%" height="60%">
            <img src="https://img9.doubanio.com/view/photo/l/public/p2666541015.jpg" width="60%" height="60%">
            <img src="https://img1.doubanio.com/view/photo/l/public/p2635721037.jpg" width="60%" height="60%">                         
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
