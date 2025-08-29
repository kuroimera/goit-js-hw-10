// Описаний у документації
import iziToast from 'izitoast';
// Додатковий імпорт стилів
import 'izitoast/dist/css/iziToast.min.css';

const form = document.querySelector('.form');
const delayInput = document.querySelector('.delay-input');
const delayRadioFull = document.querySelector('.delay-radio-full');
const delayRadioRej = document.querySelector('.delay-radio-rej');
//ділей в інпуті = ділей в промісі
// іф ділей радіо тру то проміс резолв і виводимо повідомлення, елс кетч і виводимо повідомлення
form.addEventListener('submit', event => {
  event.preventDefault();
  const delay = Number(delayInput.value);

  if (!delay || (!delayRadioFull.checked && !delayRadioRej.checked)) return;
  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      if (delayRadioFull.checked) {
        resolve(delay);
      } else if (delayRadioRej.checked) {
        reject(delay);
      }
    }, delay);
  });

  promise
    .then(ms => {
      iziToast.success({
        title: 'Success',
        message: `✅ Fulfilled promise in ${ms}ms`,
        position: 'topRight',
      });
    })
    .catch(ms => {
      iziToast.error({
        title: 'Error',
        message: `❌ Rejected promise in ${ms}ms`,
        position: 'topRight',
      });
    });
});
