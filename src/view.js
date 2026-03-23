import { subscribe } from 'valtio/vanilla';

const renderInput = (state, input) => {
  if (state.form.status === 'invalid') {
    input.classList.add('is-invalid');
    return;
  }

  input.classList.remove('is-invalid');
};

const renderFeedback = (state, feedback) => {
  feedback.className = 'feedback mt-2 mb-0';

  if (state.form.status === 'invalid') {
    feedback.classList.add('text-danger');
    feedback.textContent = state.form.error;
    return;
  }

  if (state.form.status === 'valid') {
    feedback.classList.add('text-success');
    feedback.textContent = 'RSS успешно загружен';
    return;
  }

  feedback.textContent = '';
};

const renderSubmitButton = (state, button) => {
  button.disabled = state.form.status === 'sending';
};

const render = (state, elements) => {
  renderInput(state, elements.input);
  renderFeedback(state, elements.feedback);
  renderSubmitButton(state, elements.submitButton);
};

const initView = (state, elements) => {
  render(state, elements);
  subscribe(state, () => render(state, elements));
};

export default initView;
