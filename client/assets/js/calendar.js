const monthYear = document.getElementById("monthYear");
const calendarBody = document.getElementById("calendarBody");

let date = new Date();

function renderCalendar() {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();

  monthYear.textContent = `${date.toLocaleString('default', { month: 'long' })} ${year}`;
  calendarBody.innerHTML = "";

  let row = "<tr>";
  for (let i = 0; i < firstDay; i++) row += "<td></td>";

  for (let day = 1; day <= lastDate; day++) {
    const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();
    row += `<td class="${isToday ? 'today' : ''}">${day}</td>`;
    if ((firstDay + day) % 7 === 0) {
      row += "</tr><tr>";
    }
  }

  row += "</tr>";
  calendarBody.innerHTML = row;
}

document.getElementById("prevMonth").addEventListener("click", () => {
  date.setMonth(date.getMonth() - 1);
  renderCalendar();
});
document.getElementById("nextMonth").addEventListener("click", () => {
  date.setMonth(date.getMonth() + 1);
  renderCalendar();
});

renderCalendar();
