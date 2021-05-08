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
                    <p><a href="https://tkfans.tk/TV/JTV/[2013.07.07]%E5%8D%8A%E6%B3%BD%E7%9B%B4%E6%A0%91+/">半泽直树</a></p>
                    <p><a href="https://tkfans.tk/TV/JTV/[2005.07.08]%E9%BE%99%E6%A8%B1+/">龙樱</a></p>
                    <p><a href="https://tkfans.tk/Films/%E7%BB%8F%E5%85%B8%E7%94%B5%E5%BD%B1/%E4%BD%A0%E5%A5%BD%EF%BC%8C%E6%9D%8E%E7%84%95%E8%8B%B1/">你好，李焕英</a></p>
                    <p><a href="https://tkfans.tk/Films/%E7%B3%BB%E5%88%97%E7%94%B5%E5%BD%B1/%E5%94%90%E4%BA%BA%E8%A1%97%E6%8E%A2%E6%A1%88/">唐人街探案</a></p>
                    <p><a href="https://tkfans.tk/TV/USTV/The%20Handmaid's%20Tale/">The Handmaid's Tale</a></p>
                    <p><a href="https://tkfans.tk/TV/%E5%8A%A8%E6%BC%AB/%E9%AC%BC%E7%81%AD%E4%B9%8B%E5%88%83/%E5%89%A7%E5%9C%BA%E7%89%88/">鬼灭之刃 剧场版 无限列车篇</a></p>
                    <p><a href="https://www.tkfans.tk/Films/%E7%B3%BB%E5%88%97%E7%94%B5%E5%BD%B1/%E5%93%A5%E6%96%AF%E6%8B%89+%E9%87%91%E5%88%9A/">哥斯拉</a></p>
                    <p><a href="https://tkfans.tk/TV/JTV/[2018.01.14]%E7%8B%82%E8%B5%8C%E4%B9%8B%E6%B8%8A+/[2021.03.26]%E7%8B%82%E8%B5%8C%E4%B9%8B%E6%B8%8A%C2%B7%E5%8F%8C/">狂赌之渊·双</a></p>
                    <p><a href="https://tkfans.tk/TV/USTV/Marvel%20Studios%EF%BC%9ALegends/">Marvel Studios：Legends</a></p>
                    <p><a href="https://tkfans.tk/TV/USTV/The%20Falcon%20and%20the%20Winter%20Soldier/">The Falcon and the Winter Soldier</a></p>
                          <hr>
            <img src="https://img9.doubanio.com/view/photo/l/public/p2018085196.jpg" width="60%" height="60%">
            <img src="https://img1.doubanio.com/view/photo/l/public/p2628677419.jpg" width="60%" height="60%">
            <img src="https://img2.doubanio.com/view/photo/l/public/p2610225002.jpg" width="60%" height="60%">
            <img src="https://img9.doubanio.com/view/photo/l/public/p2634398296.jpg" width="60%" height="60%">
            <img src="https://img1.doubanio.com/view/photo/l/public/p2629056068.jpg" width="60%" height="60%">
            <img src="https://img2.doubanio.com/view/photo/l/public/p2622388983.jpg" width="60%" height="60%">
            <img src="https://img2.doubanio.com/view/photo/l/public/p2622388913.jpg" width="60%" height="60%">
            <img src="https://img9.doubanio.com/view/photo/l/public/p2637722515.jpg" width="60%" height="60%">
            <img src="https://img3.doubanio.com/view/photo/l/public/p2595123270.jpg" width="60%" height="60%">
            <img src="https://img3.doubanio.com/view/photo/l/public/p2634919811.jpg" width="60%" height="60%">
            <img src="https://img3.doubanio.com/view/photo/l/public/p2634367251.jpg" width="60%" height="60%">
            <img src="https://img9.doubanio.com/view/photo/l/public/p2630139764.jpg" width="60%" height="60%">
            <img src="https://img9.doubanio.com/view/photo/l/public/p2632487996.jpg" width="60%" height="60%">
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
