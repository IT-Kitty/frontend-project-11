import './style.css';
import { proxy } from 'valtio/vanilla';
import initView from './view.js';
import validateUrl from './validateUrl.js';

const render = () => {
  const app = document.querySelector('#app');

  app.innerHTML = `
    <div class="d-flex flex-column min-vh-100 bg-light">
      <header class="py-5 border-bottom bg-dark text-white">
        <div class="container">
          <div class="row">
            <div class="col-12 col-lg-10">
              <h1 class="display-3 lh-1 mb-3">RSS агрегатор</h1>
              <p class="lead mb-4 text-white">Начните читать RSS сегодня! Это легко, это красиво.</p>
              <form class="rss-form" data-rss-form>
                <div class="row g-3 align-items-start">
                  <div class="col-12 col-lg-9">
                    <label for="rss-url" class="visually-hidden">Ссылка RSS</label>
                    <input
                      id="rss-url"
                      name="url"
                      type="text"
                      class="form-control py-3"
                      placeholder="Ссылка RSS"
                      aria-label="RSS URL"
                      autocomplete="off"
                      required
                    >
                    <div class="form-text text-white-50 mt-2">Пример: https://lorem-rss.hexlet.app/feed</div>
                  </div>
                  <div class="col-12 col-lg-3 d-grid">
                    <button type="submit" class="btn btn-lg btn-primary">Добавить</button>
                  </div>
                </div>
              </form>
              <p class="feedback mt-3 mb-0" data-feedback></p>
            </div>
          </div>
        </div>
      </header>
      <main class="flex-grow-1"></main>
    </div>
  `;
};

const state = proxy({
  feeds: [],
  form: {
    status: 'idle',
    error: '',
  },
});

const setupForm = () => {
  const form = document.querySelector('[data-rss-form]');
  const input = form.querySelector('input[name="url"]');
  const feedback = document.querySelector('[data-feedback]');
  const submitButton = form.querySelector('button[type="submit"]');

  initView(state, {
    input,
    feedback,
    submitButton,
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const url = formData.get('url');
    const existingUrls = state.feeds.slice();

    state.form.status = 'sending';
    state.form.error = '';

    validateUrl(url, existingUrls)
      .then((validatedUrl) => {
        state.feeds.push(validatedUrl);
        state.form.status = 'valid';
        form.reset();
        input.focus();
      })
      .catch((error) => {
        state.form.status = 'invalid';
        state.form.error = error.message;
      });
  });
};

render();
setupForm();
