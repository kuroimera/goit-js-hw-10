// Описаний в документації
import flatpickr from 'flatpickr';
// Додатковий імпорт стилів
import 'flatpickr/dist/flatpickr.min.css';

// Описаний у документації
import iziToast from 'izitoast';
// Додатковий імпорт стилів
import 'izitoast/dist/css/iziToast.min.css';

let userSelectedDate;
let timerInterval = null;

const startButton = document.querySelector('.start-button');

const datetimePicker = document.querySelector('#datetime-picker');

const daysSpan = document.querySelector('[data-days]'); //підключаєось до дат щоб могли потім через текст контентт їх міняти
const hoursSpan = document.querySelector('[data-hours]');
const minutesSpan = document.querySelector('[data-minutes]');
const secondsSpan = document.querySelector('[data-seconds]');

const options = {
  //підключення бібліотеки для календарика
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    // функція бере масив обраних дат і якщо вона в минулому дає помилку
    userSelectedDate = selectedDates[0]; // юзер селектед дейт це по факту перша і єдина дата з того масиву.
    if (userSelectedDate < new Date()) {
      // перевіряємо її
      iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future',
        position: 'topRight',
      });
      startButton.setAttribute('disabled', true); //якщо дата не підходить то робимо на кнопку дізейблд
      return; //повертаємо щоб далі якщо що міг виконуватися код
    } else {
      startButton.removeAttribute('disabled'); // якщо дата правильно то прибираємо атрибут дісейблд
    }
  },
};

flatpickr('#datetime-picker', options);

function convertMs(ms) {
  //функція що конвертує мілісекунди в секунди хвилини години і дні
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining
  const days = Math.floor(ms / day); //мілісекунди ділимо на мілісекунди у дні і отримуємо кількість днів
  const hours = Math.floor((ms % day) / hour); //залишок після днів конвертуємо в години і так далі
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds }; //повертаємо кількість днів, годин, хвилин, секунд
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0'); //додаємо нулики якщо значення одночислове
}

function updateTimer() {
  //функція що застосовується кожну секунду в інтервалі
  if (!userSelectedDate) return; //якщо дата не обрана то не запускаємо
  const now = new Date(); //задаємо час зараз
  const difference = userSelectedDate - now; // різницю задаємо, тобто різниця між обраною датою і теперішнім часом
  if (difference <= 0) {
    // якщо різниця = 0 або менша за 0 (бо може бути затримка і ===0 може не спрацювати)
    daysSpan.textContent = '00'; //скидуємо таймер по нулям
    hoursSpan.textContent = '00';
    minutesSpan.textContent = '00';
    secondsSpan.textContent = '00';
    datetimePicker.removeAttribute('disabled'); //скидаємо інпут, він знову активний
    clearInterval(timerInterval); //прибираємо інтервал за його айді
    return; //повертаємо
  }
  const { days, hours, minutes, seconds } = convertMs(difference); //дайс це тепер конвертовані у дні мілісекундиі і так далі
  daysSpan.textContent = addLeadingZero(days); //в нтмл замість дейсспан підставляється час що вж пройшов фунцію по додаванням нуликів і тд
  hoursSpan.textContent = addLeadingZero(hours);
  minutesSpan.textContent = addLeadingZero(minutes);
  secondsSpan.textContent = addLeadingZero(seconds);
}

startButton.addEventListener('click', () => {
  //додаємо дію на кнопку
  if (!userSelectedDate) return; //якщо час не вибраний повертаємо не виконуємо
  startButton.setAttribute('disabled', true); // після кліку кнопка дізейблд
  datetimePicker.setAttribute('disabled', true); //після кліку інпут дізейблд
  updateTimer(); //одразу оновлюємо таймер 1 раз щоб одразу все почалося
  timerInterval = setInterval(updateTimer, 1000); //далі оновлюємо кожну секунду
});
