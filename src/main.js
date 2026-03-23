import './style.css';

const render = () => {
  const app = document.querySelector('#app');

  app.innerHTML = `
    <div class="d-flex flex-column min-vh-100 bg-light">
      <header class="py-5 border-bottom bg-dark text-white">
        <div class="container">
          <div class="row">
            <div class="col-12 col-lg-10">
              <h1 class="display-3 lh-1 mb-3">RSS агрегатор</h1>
              <p class="lead mb-4 text-white-50">Начните читать RSS сегодня Это легко, это красиво</p>
              <form class="rss-form" data-rss-form>
                <div class="row g-3 align-items-start">
                  <div class="col-12 col-lg-9">
                    <input
                      id="rss-url"
                      name="url"
                      type="text"
                      class="form-control form-control-lg"
                      placeholder="Ссылка RSS"
                      aria-label="RSS URL"
                      required
                    >
                    <div class="form-text text-white-50 mt-2">Пример https://lorem-rss.hexlet.app/feed</div>
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
      <footer class="border-top py-3 text-center text-muted bg-body-secondary">
        created by <a href="https://hexlet.io" target="_blank" rel="noreferrer">Hexlet</a>
      </footer>
    </div>
  `;
};

const setupForm = () => {
  const form = document.querySelector('[data-rss-form]');
  const input = form.querySelector('input[name="url"]');
  const feedback = document.querySelector('[data-feedback]');

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const url = input.value.trim();

    Promise.resolve(url)
      .then((value) => {
        if (value.length === 0) {
          throw new Error('Введите URL RSS-потока');
        }

        feedback.className = 'feedback mt-3 mb-0 text-success-emphasis';
        feedback.textContent = 'RSS-поток добавлен';
        form.reset();
        input.focus();
      })
      .catch((error) => {
        feedback.className = 'feedback mt-3 mb-0 text-danger';
        feedback.textContent = error.message;
      });
  });
};

render();
setupForm();
