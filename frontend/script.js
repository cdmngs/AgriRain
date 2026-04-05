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
const searchResults = document.getElementById("searchResults");

if(saveLocationBtn){
  saveLocationBtn.addEventListener("click", async () => {
    const location = locationInput.value.trim();
    if(!location){ alert("Please enter a location!"); return; }
    // Validate if location is in Philippines
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}&limit=1&countrycodes=PH`);
      const data = await response.json();
      if(data.length === 0){
        alert("Invalid location. Please select a location from the search results or enter a valid Philippine location.");
        return;
      }
      // Save the validated location
      localStorage.setItem("location", data[0].display_name);
      selectedLocationDisplay.textContent = "Selected Location: " + data[0].display_name;
      locationName.textContent = data[0].display_name;
      latlong.textContent = "Lat: " + data[0].lat + ", Long: " + data[0].lon;
    } catch (error) {
      console.error("Error validating location:", error);
      alert("Error validating location. Please try again.");
    }
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

// Search functionality
if(locationInput && searchResults){
  locationInput.addEventListener("input", async (e) => {
    const query = e.target.value.trim();
    if(query.length < 3){
      searchResults.style.display = "none";
      return;
    }
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&countrycodes=PH`);
      const data = await response.json();
      searchResults.innerHTML = "";
      if(data.length === 0){
        searchResults.innerHTML = '<div class="no-results">No results found</div>';
        searchResults.style.display = "block";
      } else {
        data.forEach(item => {
          const div = document.createElement("div");
          div.className = "result-item";
          div.textContent = item.display_name;
          div.addEventListener("click", () => {
            locationInput.value = item.display_name;
            localStorage.setItem("location", item.display_name);
            selectedLocationDisplay.textContent = "Selected Location: " + item.display_name;
            locationName.textContent = item.display_name;
            latlong.textContent = "Lat: " + item.lat + ", Long: " + item.lon;
            searchResults.style.display = "none";
          });
          searchResults.appendChild(div);
        });
        searchResults.style.display = "block";
      }
    } catch (error) {
      console.error("Error fetching locations:", error);
      searchResults.innerHTML = '<div class="no-results">Error fetching results</div>';
      searchResults.style.display = "block";
    }
  });

  // Hide results when clicking outside
  document.addEventListener("click", (e) => {
    if(!locationInput.contains(e.target) && !searchResults.contains(e.target)){
      searchResults.style.display = "none";
    }
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