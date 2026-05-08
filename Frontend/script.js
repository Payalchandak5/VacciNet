const form = document.getElementById("form");
const resultDiv = document.getElementById("result");
let selectedHospital = "";
let currentVaccines = {};
let userPincode = "";

const user = localStorage.getItem("user");

if (!user) {
    window.location.href = "login.html";
}

// Step 1
const formSection = document.getElementById("formSection");
const dashboard = document.getElementById("dashboard");
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const birthDate = document.getElementById("birthDate").value;
    userPincode = Number(document.getElementById("pincode").value);

    if (!/^[1-9][0-9]{5}$/.test(userPincode)) {
        alert("Invalid pincode! Enter valid 6-digit Indian pincode");
        return;
    }

    // 🔥 SWITCH SCREEN
    formSection.style.display = "none";
    dashboard.style.display = "block";

    if (!name || !birthDate) {
        alert("Please fill all fields!");
        return;
    }

    // ✅ ADD TRY-CATCH HERE
    try {
        const res = await fetch("https://vaccinet-backend.onrender.com/api/vaccines", {
            method: "POST",
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify({ name, birthDate, takenVaccines: [] })
        });

        const data = await res.json();

        console.log("API RESPONSE:", data); // DEBUG

        if (!data || !data.remainingVaccines) {
            alert("No vaccine data received");
            return;
        }

        currentVaccines = data.remainingVaccines;
        showCheckboxes(data);

    } catch (err) {
        console.error(err);
        alert("Server error! Check backend.");
    }
});


function calculateAge(birthDate) {
    const today = new Date();
    const birth = new Date(birthDate);

    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();

    // Adjust if negative months
    if (months < 0) {
        years--;
        months += 12;
    }

    // If less than 1 year → show only months
    if (years === 0) {
        return `${months} months`;
    }

    return `${years} years ${months} months`;
}

// Step 2
function showCheckboxes(data) {
    let html = `
    <div class="top-bar">
        <span onclick="goBack()" class="back-btn material-icons">arrow_back</span>
        <h2>VacciNet</h2>
    </div>

    <p class="subtitle">Your personalized vaccination dashboard</p>

    <!-- Patient Card -->
    <div class="patient-card modern">
        <div><span class="material-icons">person</span> ${data.name}</div>
        <div><span class="material-icons">cake</span> ${calculateAge(document.getElementById("birthDate").value)}</div>
        <div><span class="material-icons">location_on</span> ${userPincode}</div>
    </div>

    <!-- 🔥 MAIN GRID -->
    <div class="main-grid">

        <!-- LEFT: VACCINES -->
        <div class="left-panel">
            <h3>💉 Available Vaccines</h3>
    `;

    for (let key in data.remainingVaccines) {
        let v = data.remainingVaccines[key];

        html += `
        <div class="vaccine-card">

            <div class="vaccine-left">
                <input type="checkbox" value="${key}" class="checkbox">
                <div class="icon-box">
                    <span class="material-icons">vaccines</span>
                </div>
            </div>

            <div class="vaccine-info">
                <h4>${v.name}</h4>
                <p class="vaccine-use">${v.use}</p>
                <p class="vaccine-due">
                    <span class="material-icons small-icon">schedule</span>
                    Due: ${v.due}
                </p>
            </div>

            <span class="priority ${v.priority}">
                ${v.priority.toUpperCase()}
            </span>

        </div>
        `;
    }

    html += `
        </div>

        <!-- RIGHT: HOSPITALS -->
        <div class="right-panel">
            <h3>🏥 Nearest Hospitals</h3>
            <div id="map" style="height:300px;"></div>
            <div id="hospitalList"></div>
        </div>

    </div>  <!-- main-grid end -->

        <div style="text-align:center; margin-top:20px;">
            <div class="center-btn">
                <button class="book-btn" onclick="submitVaccines()">
                    Continue
                </button>
            </div>
        </div>
        `;

    dashboard.innerHTML = html;

    // 🔥 AUTO LOAD hospitals (no click needed)
    findHospitals();
}

function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth radius in KM

    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;

    const a =
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI/180) *
        Math.cos(lat2 * Math.PI/180) *
        Math.sin(dLon/2) *
        Math.sin(dLon/2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return (R * c).toFixed(2);
}

// Step 3
let takenList = [];

async function submitVaccines() {
    const name = document.getElementById("name").value;
    const birthDate = document.getElementById("birthDate").value;

    const selected = [...document.querySelectorAll('.vaccine-card input:checked')]
    .map(cb => Number(cb.value));
        

    takenList = selected; // store for UI

    const res = await fetch("https://vaccinet-backend.onrender.com/api/vaccines", {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({ name, birthDate, takenVaccines: selected })
    });

    const data = await res.json();
    showFinal(data);
}

function goBack() {
    dashboard.style.display = "none";
    formSection.style.display = "block";
}

// Step 4
function showFinal(data) {
    let count = Object.keys(data.remainingVaccines).length;

    let html = `
        <div class="top-bar">
            <span onclick="goBack()" class="back-btn">⬅</span>
            <h2>VacciNet</h2>
        </div>

        <p class="subtitle">Your personalized vaccination dashboard</p>

        <div class="patient-card modern">
            <div><span class="material-icons">person</span> ${data.name}</div>
            <div><span class="material-icons">cake</span> ${calculateAge(document.getElementById("birthDate").value)}</div>
            <div><span class="material-icons">location_on</span> ${userPincode}</div>
        </div>

        <h3>⏳ Pending Vaccines (${count})</h3>
    `;

    for (let key in data.remainingVaccines) {
        let v = data.remainingVaccines[key];
        if (!v) continue;

        html += `
        <div class="vaccine-card">

            <!-- LEFT: Checkbox -->
            <input type="checkbox" value="${key}" class="checkbox">

            <!-- CENTER: Vaccine Info -->
            <div class="vaccine-info">
                <h4>${v.name}</h4>
                <p class="vaccine-use">${v.use}</p>
                <p class="vaccine-due">Due: ${v.due}</p>
                <span class="priority ${v.priority || "low"}">
                    ${(v.priority || "low").toUpperCase()}
                </span>
            </div>

        </div>`;
    }

    html += `
        <button class="book-btn" onclick="bookAppointment()">
            Book Appointment
        </button>

        <div id="hospitals"></div>
    `;

    dashboard.innerHTML = html;
}

// Step 5
async function findHospitals() {

    const pincode = userPincode;

    const location = await getLatLng(pincode);
    if (!location) return;

    const { lat, lon } = location;

    if (window.mapInstance) {
        window.mapInstance.remove();
        window.mapInstance = null;
    }

    const map = L.map('map').setView([lat, lon], 13);
    window.mapInstance = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    setTimeout(() => map.invalidateSize(), 200);

    L.marker([lat, lon]).addTo(map)
        .bindPopup("You are here")
        .openPopup();

    const hospitals = await getHospitals(lat, lon);

    console.log("Hospitals:", hospitals);

    if (!hospitals || hospitals.length === 0) {
        document.getElementById("hospitalList").innerHTML =
            "<p>No hospitals found nearby.</p>";
        return;
    }

    let html = "";

    hospitals.slice(0, 5).forEach(h => {

        const name = h.tags?.name || "Hospital";
        const latVal = h.lat || h.center?.lat;
        const lonVal = h.lon || h.center?.lon;

        if (!latVal || !lonVal) return;

        const distance = calculateDistance(lat, lon, latVal, lonVal);

        L.marker([latVal, lonVal]).addTo(map)
            .bindPopup(name);

        html += `
            <div class="hospital-card" onclick="selectHospital('${name}', this)">
                
                <div class="hospital-left">
                    <span class="material-icons location">location_on</span>
                </div>

                <div class="hospital-info">
                    <h4>${name}</h4>
                    <p>${h.tags?.["addr:full"] || "Address not available"}</p>
                    <p class="phone">${h.tags?.phone || "+91 XXXXX XXXXX"}</p>
                </div>

                <div class="distance">${distance} km</div>

            </div>`;
    });

    document.getElementById("hospitalList").innerHTML = html;
}

function selectHospital(name, element) {
    selectedHospital = name;

    // remove previous selection
    document.querySelectorAll(".hospital-card").forEach(card => {
        card.classList.remove("active");
    });

    // highlight selected
    element.classList.add("active");
}

async function getLatLng(pincode) {

    try {

        const res = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${pincode},Pune,India&limit=1`
        );

        const data = await res.json();

        console.log("LOCATION DATA:", data);

        if (!data || data.length === 0) {
            return null;
        }

        return {
            lat: parseFloat(data[0].lat),
            lon: parseFloat(data[0].lon)
        };

    } catch (err) {
        console.error(err);
        return null;
    }
}

/*async function getHospitals(lat, lon) {

    try {

        const query = `
        [out:json][timeout:40];
        (
          node["amenity"="hospital"](around:10000,${lat},${lon});
          way["amenity"="hospital"](around:10000,${lat},${lon});
          relation["amenity"="hospital"](around:10000,${lat},${lon});

          node["healthcare"="hospital"](around:10000,${lat},${lon});
          way["healthcare"="hospital"](around:10000,${lat},${lon});

          node["amenity"="clinic"](around:10000,${lat},${lon});
          way["amenity"="clinic"](around:10000,${lat},${lon});
        );
        out center;
        `;

        const res = await fetch(
            "https://overpass.kumi.systems/api/interpreter",
            {
                method: "POST",
                body: query
            }
        );

        const data = await res.json();

        console.log("OVERPASS RESPONSE:", data);

        if (!data.elements || data.elements.length === 0) {
            return [];
        }

        return data.elements;

    } catch (err) {
        console.error("Hospital Fetch Error:", err);
        return [];
    }
}*/
async function getHospitals(lat, lon) {

    // Try API first
    try {

        const query = `
        [out:json][timeout:15];
        (
          node["amenity"="hospital"](around:3000,${lat},${lon});
        );
        out center;
        `;

        const hospitals = await fetchOverpass(query);

        // ✅ If API gives data use it
        if (hospitals.length > 0) {
            return hospitals;
        }

    } catch (err) {
        console.log("Using fallback hospitals...");
    }

    // ✅ FALLBACK STATIC DATA
    return [

    {
        lat: 18.5091,
        lon: 73.8326,
        tags: {
            name: "Deenanath Mangeshkar Hospital",
            phone: "+91 20 40151000",
            "addr:full": "Erandwane, Pune"
        }
    },

    {
        lat: 18.5314,
        lon: 73.8446,
        tags: {
            name: "Ruby Hall Clinic",
            phone: "+91 20 66455100",
            "addr:full": "Dhole Patil Road, Pune"
        }
    },

    {
        lat: 18.5163,
        lon: 73.8410,
        tags: {
            name: "Jehangir Hospital",
            phone: "+91 20 66819999",
            "addr:full": "Sassoon Road, Pune"
        }
    },

    {
        lat: 18.4575,
        lon: 73.8508,
        tags: {
            name: "Noble Hospital",
            phone: "+91 20 66285000",
            "addr:full": "Hadapsar, Pune"
        }
    },

    {
        lat: 18.4635,
        lon: 73.8690,
        tags: {
            name: "Bharati Hospital",
            phone: "+91 20 40555555",
            "addr:full": "Katraj, Pune"
        }
    },

    {
        lat: 18.5590,
        lon: 73.8078,
        tags: {
            name: "Aditya Birla Memorial Hospital",
            phone: "+91 20 30717500",
            "addr:full": "Pimpri-Chinchwad, Pune"
        }
    },

    {
        lat: 18.4967,
        lon: 73.8070,
        tags: {
            name: "Lokmanya Hospital",
            phone: "+91 20 46606800",
            "addr:full": "Nigdi, Pune"
        }
    },

    {
        lat: 18.5208,
        lon: 73.8567,
        tags: {
            name: "Sassoon General Hospital",
            phone: "+91 20 26128000",
            "addr:full": "Near Pune Station"
        }
    },

    {
        lat: 18.5058,
        lon: 73.9272,
        tags: {
            name: "Columbia Asia Hospital",
            phone: "+91 20 71290222",
            "addr:full": "Kharadi, Pune"
        }
    },

    {
        lat: 18.5890,
        lon: 73.7995,
        tags: {
            name: "DY Patil Hospital",
            phone: "+91 20 27805000",
            "addr:full": "Pimpri, Pune"
        }
    },

    {
        lat: 18.5089,
        lon: 73.9257,
        tags: {
            name: "Manipal Hospital",
            phone: "+91 20 68138888",
            "addr:full": "Kharadi, Pune"
        }
    },

    {
        lat: 18.5642,
        lon: 73.9146,
        tags: {
            name: "Aster Medipoint Hospital",
            phone: "+91 20 66040000",
            "addr:full": "Aundh, Pune"
        }
    },

    {
        lat: 18.5074,
        lon: 73.8077,
        tags: {
            name: "KEM Hospital",
            phone: "+91 20 66037300",
            "addr:full": "Rasta Peth, Pune"
        }
    },

    {
        lat: 18.4896,
        lon: 73.8213,
        tags: {
            name: "Poona Hospital",
            phone: "+91 20 24331706",
            "addr:full": "Sadashiv Peth, Pune"
        }
    },

    {
        lat: 18.5730,
        lon: 73.7798,
        tags: {
            name: "PCMC YCM Hospital",
            phone: "+91 20 67331111",
            "addr:full": "Pimpri, Pune"
        }
    }

];
}

/*async function fetchOverpass(query) {
    try {
        const res = await fetch("https://overpass.kumi.systems/api/interpreter", {
            method: "POST",
            body: query
        });

        const text = await res.text();

        // ❌ Handle HTML/XML error
        if (!text.startsWith("{")) {
            console.warn("Non-JSON response (timeout/server error)");
            return [];
        }

        const data = JSON.parse(text);
        return data.elements || [];

    } catch (err) {
        console.error("Fetch failed:", err);
        return [];
    }
}*/
async function fetchOverpass(query) {

    try {

        const res = await fetch(
            "https://overpass.kumi.systems/api/interpreter",
            {
                method: "POST",
                body: query
            }
        );

        const text = await res.text();

        console.log("RAW RESPONSE:", text);

        // ❌ API returned XML/HTML error
        if (text.startsWith("<")) {
            console.warn("Overpass server timeout/error");
            return [];
        }

        const data = JSON.parse(text);

        return data.elements || [];

    } catch (err) {

        console.error("Overpass Fetch Failed:", err);

        return [];
    }
}

function bookAppointment() {
    console.log("Button clicked");

    if (!selectedHospital) {
        alert("Please select a hospital first!");
        return;
    }

    alert(`✅ Appointment booked at ${selectedHospital}`);
}

document.addEventListener("change", (e) => {
    if (e.target.classList.contains("checkbox")) {
        const card = e.target.closest(".vaccine-card");

        if (e.target.checked) {
            card.classList.add("selected");
        } else {
            card.classList.remove("selected");
        }
    }
});
function logout() {
    localStorage.removeItem("user");
    window.location.href = "login.html";
}