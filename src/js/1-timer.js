import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const datetimePicker = document.getElementById("datetime-picker");
const startButton = document.querySelector("[data-start]");
const daysValue = document.querySelector("[data-days]");
const hoursValue = document.querySelector("[data-hours]");
const minutesValue = document.querySelector("[data-minutes]");
const secondsValue = document.querySelector("[data-seconds]");
startButton.disabled = true;

let userSelectedDate;

const options = {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,
    onClose(selectedDates) {
        const selectedDate = selectedDates[0];

        if (selectedDate <= new Date()) {
            iziToast.error({
                title: "Error",
                message: "Please choose a date in the future",
            });
            startButton.disabled = true;
        } else {
            userSelectedDate = selectedDate;
            startButton.disabled = false;
        }
    },
};

flatpickr(datetimePicker, options);

startButton.addEventListener("click", () => {
    if (!userSelectedDate) return;

    datetimePicker.disabled = true;
    startButton.disabled = true;

    let timerInterval = setInterval(() => {
        const timeDifference = userSelectedDate.getTime() - new Date().getTime();

        if (timeDifference <= 0) {
            clearInterval(timerInterval);
            datetimePicker.disabled = false;
            return;
        }

        const time = convertMs(timeDifference);
        updateTimerDisplay(time);
    }, 1000);
});

function convertMs(ms) {
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    const days = Math.floor(ms / day);
    const hours = Math.floor((ms % day) / hour);
    const minutes = Math.floor(((ms % day) % hour) / minute);
    const seconds = Math.floor((((ms % day) % hour) % minute) / second);

    return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
    return value.toString().padStart(2, "0");
}

function updateTimerDisplay({ days, hours, minutes, seconds }) {
    daysValue.textContent = days;
    hoursValue.textContent = addLeadingZero(hours);
    minutesValue.textContent = addLeadingZero(minutes);
    secondsValue.textContent = addLeadingZero(seconds);
}