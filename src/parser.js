const getTextContent = (element, selector) => element.querySelector(selector)?.textContent?.trim() ?? ''

const parseRss = (xml) => {
  const parser = new DOMParser()
  const document = parser.parseFromString(xml, 'application/xml')

  if (document.querySelector('parsererror')) {
    throw new Error('errors.invalidRss')
  }

  const channel = document.querySelector('channel')
  const feedTitle = getTextContent(channel, 'title')
  const feedDescription = getTextContent(channel, 'description')

  if (!channel || !feedTitle || !feedDescription) {
    throw new Error('errors.invalidRss')
  }

  const posts = Array.from(document.querySelectorAll('item'))
    .map(item => ({
      title: getTextContent(item, 'title'),
      description: getTextContent(item, 'description'),
      link: getTextContent(item, 'link'),
    }))
    .filter(post => post.title && post.link)

  return {
    feed: {
      title: feedTitle,
      description: feedDescription,
    },
    posts,
  }
}

export default parseRss
