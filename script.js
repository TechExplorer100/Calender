const prevMonthButton = document.getElementById('prevMonth');
const nextMonthButton = document.getElementById('nextMonth');
const monthName = document.getElementById('monthName');
const calendarDays = document.getElementById('calendarDays');
const eventModal = document.getElementById('eventModal');
const closeModal = document.getElementById('closeModal');
const saveEventButton = document.getElementById('saveEvent');
const deleteEventButton = document.getElementById('deleteEvent');
const eventInput = document.getElementById('eventInput');
let currentDate = new Date();
let currentDay = null;
let events = JSON.parse(localStorage.getItem('events')) || {};

function renderCalendar(date) {
    const month = date.getMonth();
    const year = date.getFullYear();

    monthName.textContent = date.toLocaleString('default', { month: 'long' }) + " " + year;

    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    calendarDays.innerHTML = '';

    // Create 42 boxes (6 weeks * 7 days) to avoid shifting issues
    for (let i = 0; i < 42; i++) {
        let dayBox = document.createElement("div");
        dayBox.classList.add("day");

        let dayNumber = i - firstDayOfMonth + 1;

        if (dayNumber > 0 && dayNumber <= daysInMonth) {
            const dayString = `${year}-${month + 1}-${dayNumber}`;
            dayBox.textContent = dayNumber;
            dayBox.dataset.day = dayString;

            if (events[dayString]) {
                dayBox.classList.add("has-event");
            }

            if (new Date(year, month, dayNumber).toDateString() === new Date().toDateString()) {
                dayBox.classList.add("today");
            }
        } else {
            dayBox.style.visibility = "hidden"; // Hide extra boxes
        }

        calendarDays.appendChild(dayBox);
    }
}

function openEventModal(day) {
    currentDay = day;
    eventInput.value = events[day] || '';  // Show event text if exists
    eventInput.disabled = false; // Enable input for adding/editing event
    eventModal.style.display = 'flex';

    // Delete button is shown if event exists
    deleteEventButton.style.display = events[day] ? 'inline-block' : 'none';
}

function closeEventModal() {
    eventModal.style.display = 'none';
}

function saveEvent() {
    if (currentDay) {
        events[currentDay] = eventInput.value;
        localStorage.setItem('events', JSON.stringify(events));
        renderCalendar(currentDate);
        closeEventModal();
    }
}

function deleteEvent() {
    if (currentDay) {
        delete events[currentDay];
        localStorage.setItem('events', JSON.stringify(events));
        renderCalendar(currentDate);
        closeEventModal();
    }
}

prevMonthButton.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar(currentDate);
});

nextMonthButton.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar(currentDate);
});

calendarDays.addEventListener('click', (e) => {
    if (e.target.classList.contains('day')) {
        const day = e.target.getAttribute('data-day');
        openEventModal(day);
    }
});

closeModal.addEventListener('click', closeEventModal);
saveEventButton.addEventListener('click', saveEvent);
deleteEventButton.addEventListener('click', deleteEvent);

renderCalendar(currentDate);