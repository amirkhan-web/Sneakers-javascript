import { days, details, hours, minutes, seconds } from './selectors';

const countDownTimer = () => {
  const daysLeft = new Date().getDay() + 4;
  const hoursLeft = new Date().getHours();
  const minutesLeft = new Date().getMinutes();
  const secondsLeft = new Date().getSeconds();

  days.textContent = daysLeft < 10 ? '0' + daysLeft : daysLeft;
  hours.textContent = hoursLeft < 10 ? '0' + hoursLeft : hoursLeft;
  minutes.textContent = minutesLeft < 10 ? '0' + minutesLeft : minutesLeft;
  seconds.textContent = secondsLeft < 10 ? '0' + secondsLeft : secondsLeft;
};

if (!details) {
  countDownTimer();

  setInterval(countDownTimer, 1000);
}
