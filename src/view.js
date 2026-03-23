import { subscribe } from 'valtio/vanilla'

const translate = (i18n, key) => (key ? i18n.t(key) : '')

const renderInput = (state, input) => {
  if (state.form.status === 'invalid') {
    input.classList.add('is-invalid')
    return
  }

  input.classList.remove('is-invalid')
}

const renderFeedback = (state, feedback, i18n) => {
  feedback.className = 'feedback mt-2 mb-0'

  if (state.form.status === 'invalid') {
    feedback.classList.add('text-danger')
    feedback.textContent = translate(i18n, state.form.error)
    return
  }

  if (state.form.status === 'valid') {
    feedback.classList.add('text-success')
    feedback.textContent = i18n.t('feedback.success')
    return
  }

  feedback.textContent = ''
}

const renderSubmitButton = (state, button) => {
  button.disabled = state.form.status === 'sending'
}

const renderFeeds = (state, feedsNode, feedsContainer) => {
  if (state.feeds.length === 0) {
    feedsContainer.classList.add('d-none')
    feedsNode.innerHTML = ''
    return
  }

  feedsContainer.classList.remove('d-none')
  feedsNode.innerHTML = state.feeds
    .map((feed) => `
      <li class="list-group-item border-0 px-0">
        <h3 class="h5 mb-1">${feed.title}</h3>
        <p class="mb-0 text-muted">${feed.description}</p>
      </li>
    `)
    .join('')
}

const renderPosts = (state, postsNode, postsContainer, i18n) => {
  if (state.posts.length === 0) {
    postsContainer.classList.add('d-none')
    postsNode.innerHTML = ''
    return
  }

  postsContainer.classList.remove('d-none')
  postsNode.innerHTML = state.posts
    .map((post) => {
      const isRead = state.ui.readPostIds.includes(post.id)
      const linkClass = isRead ? 'fw-normal link-secondary' : 'fw-bold'

      return `
      <li class="list-group-item border-0 px-0 d-flex justify-content-between align-items-start gap-3">
        <a
          href="${post.link}"
          target="_blank"
          rel="noopener noreferrer"
          data-post-id="${post.id}"
          class="${linkClass}"
        >${post.title}</a>
        <button
          type="button"
          class="btn btn-outline-primary btn-sm"
          data-preview-id="${post.id}"
        >${i18n.t('ui.previewButton')}</button>
      </li>
    `
    })
    .join('')
}

const renderModal = (state, elements) => {
  const currentPost = state.posts.find((post) => post.id === state.ui.modalPostId)

  if (!currentPost) {
    elements.modalTitle.textContent = ''
    elements.modalDescription.textContent = ''
    elements.modalReadFullLink.href = '#'
    return
  }

  elements.modalTitle.textContent = currentPost.title
  elements.modalDescription.textContent = currentPost.description
  elements.modalReadFullLink.href = currentPost.link
}

const render = (state, elements) => {
  renderInput(state, elements.input)
  renderFeedback(state, elements.feedback, elements.i18n)
  renderSubmitButton(state, elements.submitButton)
  renderFeeds(state, elements.feeds, elements.feedsContainer)
  renderPosts(state, elements.posts, elements.postsContainer, elements.i18n)
  renderModal(state, elements)
}

const initView = (state, elements) => {
  render(state, elements)
  subscribe(state, () => render(state, elements))
}

export default initView
