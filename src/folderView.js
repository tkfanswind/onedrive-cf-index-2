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
                    <p><a href="https://tkfans.tk/TV/JTV/[1998.07.07]%E9%BA%BB%E8%BE%A3%E6%95%99%E5%B8%88%20GTO/">麻辣教师 GTO</a></p>
                    <p><a href="https://tkfans.tk/TV/JTV/[2019.08.08]%E5%85%A8%E8%A3%B8%E5%AF%BC%E6%BC%94+/">全裸导演</a></p>
                    <p><a href="https://tkfans.tk/TV/JTV/%E7%B1%B3%E4%BB%93%E5%87%89%E5%AD%90/[2012.10.18]Doctor-X(Y)+/">Doctor-X</a></p>
                    <p><a href="https://tkfans.tk/TV/JTV/[2013.07.07]%E5%8D%8A%E6%B3%BD%E7%9B%B4%E6%A0%91+/">半泽直树</a></p>
                    <p><a href="https://tkfans.tk/TV/JTV/[2005.07.08]%E9%BE%99%E6%A8%B1+/">龙樱</a></p>
                    <p><a href="https://tkfans.tk/TV/USTV/The%20Handmaid's%20Tale/">The Handmaid's Tale</a></p>
                    <p><a href="https://tkfans.tk/TV/JTV/[2018.01.14]%E7%8B%82%E8%B5%8C%E4%B9%8B%E6%B8%8A+/[2021.03.26]%E7%8B%82%E8%B5%8C%E4%B9%8B%E6%B8%8A%C2%B7%E5%8F%8C/">狂赌之渊·双</a></p>
                          <hr>
            <img src="https://img9.doubanio.com/view/photo/l/public/p2554039676.jpg" width="60%" height="60%">
            <img src="https://img9.doubanio.com/view/photo/l/public/p2155142584.jpg" width="60%" height="60%">
            <img src="https://img3.doubanio.com/view/photo/l/public/p1740406621.jpg" width="60%" height="60%">
            <img src="https://img3.doubanio.com/view/photo/l/public/p2565924481.jpg" width="60%" height="60%">
            <img src="https://img3.doubanio.com/view/photo/l/public/p2103421840.jpg" width="60%" height="60%">
            <img src="https://img3.doubanio.com/view/photo/l/public/p2152700651.jpg" width="60%" height="60%">
            <img src="https://img3.doubanio.com/view/photo/l/public/p2217658640.jpg" width="60%" height="60%">
            <img src="https://img9.doubanio.com/view/photo/l/public/p2361217836.jpg" width="60%" height="60%">
            <img src="https://img9.doubanio.com/view/photo/l/public/p2385439756.jpg" width="60%" height="60%">
            <img src="https://img1.doubanio.com/view/photo/l/public/p2500408007.jpg" width="60%" height="60%">
            <img src="https://img3.doubanio.com/view/photo/l/public/p2570433291.jpg" width="60%" height="60%">
            <img src="https://img9.doubanio.com/view/photo/l/public/p2018085196.jpg" width="60%" height="60%">
            <img src="https://img1.doubanio.com/view/photo/l/public/p2628677419.jpg" width="60%" height="60%">
            <img src="https://img2.doubanio.com/view/photo/l/public/p2610225002.jpg" width="60%" height="60%">
            <img src="https://img1.doubanio.com/view/photo/l/public/p2590894957.jpg" width="60%" height="60%">
            <img src="https://img2.doubanio.com/view/photo/l/public/p545850913.jpg" width="60%" height="60%">
            <img src="https://img9.doubanio.com/view/photo/l/public/p2634398296.jpg" width="60%" height="60%">
            <img src="https://img2.doubanio.com/view/photo/l/public/p2013503692.jpg" width="60%" height="60%">
            <img src="https://img9.doubanio.com/view/photo/l/public/p2637722515.jpg" width="60%" height="60%">
            <img src="https://img3.doubanio.com/view/photo/l/public/p2634367251.jpg" width="60%" height="60%">
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
