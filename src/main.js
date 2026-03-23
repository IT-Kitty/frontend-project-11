import './style.css';
import { proxy } from 'valtio/vanilla';
import initView from './view.js';
import validateUrl from './validateUrl.js';
import initI18n from './i18n.js';
import fetchRss from './api.js';
import parseRss from './parser.js';

let idCounter = 1;
const getNextId = () => idCounter++;

const render = (i18n) => {
  const app = document.querySelector('#app');
  const t = i18n.t.bind(i18n);

  app.innerHTML = `
    <div class="d-flex flex-column min-vh-100 bg-light">
      <header class="py-5 border-bottom bg-dark text-white">
        <div class="container">
          <div class="row">
            <div class="col-12 col-lg-10">
              <h1 class="display-3 lh-1 mb-3">${t('ui.title')}</h1>
              <p class="lead mb-4 text-white">${t('ui.description')}</p>
              <form class="rss-form" data-rss-form>
                <div class="row g-3 align-items-start">
                  <div class="col-12 col-lg-9">
                    <label for="rss-url" class="visually-hidden">${t('ui.rssLabel')}</label>
                    <input
                      id="rss-url"
                      name="url"
                      type="text"
                      class="form-control py-3"
                      placeholder="${t('ui.rssPlaceholder')}"
                      aria-label="${t('ui.rssAriaLabel')}"
                      autocomplete="off"
                      required
                    >
                    <div class="form-text text-white-50 mt-2">${t('ui.rssExample')}</div>
                  </div>
                  <div class="col-12 col-lg-3 d-grid">
                    <button type="submit" class="btn btn-lg btn-primary">${t('ui.submitButton')}</button>
                  </div>
                </div>
              </form>
              <p class="feedback mt-3 mb-0" data-feedback></p>
            </div>
          </div>
        </div>
      </header>
      <main class="flex-grow-1 py-5">
        <div class="container">
          <div class="row g-4">
            <div class="col-12 col-lg-6" data-posts-container>
              <div class="card border-0">
                <div class="card-body">
                  <h2 class="h3 mb-0">${t('ui.postsHeader')}</h2>
                  <ul class="list-group list-group-flush mt-4" data-posts></ul>
                </div>
              </div>
            </div>
            <div class="col-12 col-lg-6" data-feeds-container>
              <div class="card border-0">
                <div class="card-body">
                  <h2 class="h3 mb-0">${t('ui.feedsHeader')}</h2>
                  <ul class="list-group list-group-flush mt-4" data-feeds></ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  `;
};

const state = proxy({
  feeds: [],
  posts: [],
  form: {
    status: 'idle',
    error: null,
  },
});

const loadRssData = (url) => fetchRss(url).then((xml) => parseRss(xml));

const addFeedToState = (stateData, url, parsedFeed) => {
  const feedId = getNextId();
  const feed = {
    id: feedId,
    url,
    title: parsedFeed.feed.title,
    description: parsedFeed.feed.description,
  };

  const posts = parsedFeed.posts.map((post) => ({
    id: getNextId(),
    feedId,
    title: post.title,
    description: post.description,
    link: post.link,
  }));

  stateData.feeds.unshift(feed);
  stateData.posts.unshift(...posts);
};

const setupForm = (i18n) => {
  const form = document.querySelector('[data-rss-form]');
  const input = form.querySelector('input[name="url"]');
  const feedback = document.querySelector('[data-feedback]');
  const submitButton = form.querySelector('button[type="submit"]');
  const posts = document.querySelector('[data-posts]');
  const feeds = document.querySelector('[data-feeds]');
  const postsContainer = document.querySelector('[data-posts-container]');
  const feedsContainer = document.querySelector('[data-feeds-container]');

  initView(state, {
    i18n,
    input,
    feedback,
    submitButton,
    posts,
    feeds,
    postsContainer,
    feedsContainer,
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const url = formData.get('url')?.toString().trim() ?? '';
    const existingUrls = state.feeds.map((feed) => feed.url);

    state.form.status = 'sending';
    state.form.error = null;

    validateUrl(url, existingUrls)
      .then((validatedUrl) => loadRssData(validatedUrl).then((parsedData) => ({
        validatedUrl,
        parsedData,
      })))
      .then(({ validatedUrl, parsedData }) => {
        addFeedToState(state, validatedUrl, parsedData);
        state.form.status = 'valid';
        form.reset();
        input.focus();
      })
      .catch((error) => {
        state.form.status = 'invalid';
        state.form.error = error.message ?? 'errors.network';
      });
  });
};

initI18n().then((i18n) => {
  render(i18n);
  setupForm(i18n);
});
