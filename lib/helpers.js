export function appendSlash(url) {
  if (!url) {
    return url
  }

  url += url.endsWith('/') ? '' : '/'
  return url
}
