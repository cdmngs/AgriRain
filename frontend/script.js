// Landing Page
const getStartedBtn = document.getElementById("getStartedBtn");
const howItWorksBtn = document.getElementById("howItWorksBtn");
if(getStartedBtn){
  getStartedBtn.addEventListener("click", () => {
    window.location.href = "step1.html";
  });
}

if(howItWorksBtn){
  howItWorksBtn.addEventListener("click", () => {
    const section = document.querySelector('.how-it-works');
    if(section){
      section.scrollIntoView({ behavior: 'smooth' });
    }
  });
}

// Step 1
const saveLocationBtn = document.getElementById("saveLocationBtn");
const currentLocationBtn = document.getElementById("currentLocationBtn");
const nextBtn = document.getElementById("nextBtn");
const locationInput = document.getElementById("locationInput");
const selectedLocationDisplay = document.getElementById("selectedLocationDisplay");
const locationName = document.getElementById("locationName");
const latlong = document.getElementById("latlong");

if(saveLocationBtn){
  saveLocationBtn.addEventListener("click", () => {
    const location = locationInput.value.trim();
    if(!location){ alert("Please enter a location!"); return; }
    localStorage.setItem("location", location);
    selectedLocationDisplay.textContent = "Selected Location: " + location;
  });
}

if(currentLocationBtn){
  currentLocationBtn.addEventListener("click", () => {
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(pos=>{
        const coords = pos.coords.latitude + ", " + pos.coords.longitude;
        localStorage.setItem("location", coords);
        selectedLocationDisplay.textContent = "Selected Location: " + coords;
        locationName.textContent = "Current Location";
        latlong.textContent = "Lat: " + pos.coords.latitude + ", Long: " + pos.coords.longitude;
      }, ()=>{ alert("Permission denied or error fetching location"); });
    } else { alert("Geolocation not supported"); }
  });
}

if(nextBtn){
  nextBtn.addEventListener("click", () => {
    if(!localStorage.getItem("location")){ alert("Please select a location first!"); return; }
    window.location.href = "step2.html";
  });
}

// Step 2
const analyzeBtn = document.getElementById("analyzeBtn");
const plantDateInput = document.getElementById("plantDate");
const calendarGrid = document.getElementById("calendarGrid");
const monthYearLabel = document.getElementById("monthYear");
const prevMonthBtn = document.getElementById("prevMonth");
const nextMonthBtn = document.getElementById("nextMonth");

function formatDateValue(date) {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

function renderCalendar(month, year) {
  if (!calendarGrid || !monthYearLabel) return;

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = new Date(year, month, 1).toLocaleString('default', { month: 'long' });
  monthYearLabel.textContent = `${monthName} ${year}`;

  calendarGrid.innerHTML = '';
  for (let i = 0; i < firstDay; i++) {
    const empty = document.createElement('div');
    empty.className = 'calendar-day empty';
    calendarGrid.appendChild(empty);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const cellDate = new Date(year, month, day);
    const cell = document.createElement('button');
    cell.type = 'button';
    cell.className = 'calendar-day';
    cell.textContent = day;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const compareDate = new Date(cellDate);
    compareDate.setHours(0, 0, 0, 0);
    const isPast = compareDate < today;

    if (isPast) {
      cell.disabled = true;
      cell.classList.add('disabled');
    }

    if (plantDateInput && plantDateInput.value === formatDateValue(cellDate)) {
      cell.classList.add('selected');
    }

    cell.addEventListener('click', () => {
      if (cell.disabled) return;
      if (plantDateInput) {
        plantDateInput.value = formatDateValue(cellDate);
      }
      calendarGrid.querySelectorAll('.calendar-day.selected').forEach(el => el.classList.remove('selected'));
      cell.classList.add('selected');
    });

    calendarGrid.appendChild(cell);
  }
}

let currentDate = new Date();
currentDate.setHours(0, 0, 0, 0);
let calendarMonth = currentDate.getMonth();
let calendarYear = currentDate.getFullYear();

if (calendarGrid) {
  renderCalendar(calendarMonth, calendarYear);
}

if (prevMonthBtn) {
  prevMonthBtn.addEventListener('click', () => {
    if (calendarMonth === 0) {
      calendarMonth = 11;
      calendarYear -= 1;
    } else {
      calendarMonth -= 1;
    }
    renderCalendar(calendarMonth, calendarYear);
  });
}

if (nextMonthBtn) {
  nextMonthBtn.addEventListener('click', () => {
    if (calendarMonth === 11) {
      calendarMonth = 0;
      calendarYear += 1;
    } else {
      calendarMonth += 1;
    }
    renderCalendar(calendarMonth, calendarYear);
  });
}

if(analyzeBtn){
  analyzeBtn.addEventListener("click", ()=>{
    const date = plantDateInput.value;
    if(!date){ alert("Please select a date!"); return; }
    localStorage.setItem("plantDate", date);
    window.location.href = "step3.html";
  });
}