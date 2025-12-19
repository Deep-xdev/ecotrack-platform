// --- 1. Real AQI & Gas Data Snapshot (Dec 16, 2025) ---
const cityData = {
    delhi: { aqi: 349, status: "Severe", pm25: 320, pm10: 480, co: 42.0, no2: 49, so2: 13, o3: 6 },
    mumbai: { aqi: 55, status: "Satisfactory", pm25: 36, pm10: 58, co: 6.0, no2: 24, so2: 2, o3: 13 },
    bengaluru: { aqi: 162, status: "Moderate", pm25: 89, pm10: 111, co: 8.0, no2: 6, so2: 4, o3: 11 },
    chennai: { aqi: 144, status: "Moderate", pm25: 54, pm10: 74, co: 5.0, no2: 8, so2: 2, o3: 20 },
    kolkata: { aqi: 193, status: "Unhealthy", pm25: 193, pm10: 135, co: 6.0, no2: 14, so2: 13, o3: 10 },
    hyderabad: { aqi: 191, status: "Unhealthy", pm25: 111, pm10: 134, co: 4.0, no2: 5, so2: 8, o3: 13 },
    pune: { aqi: 294, status: "Poor", pm25: 208, pm10: 256, co: 10.5, no2: 45, so2: 15, o3: 28 },
    ahmedabad: { aqi: 160, status: "Moderate", pm25: 117, pm10: 98, co: 13.0, no2: 23, so2: 5, o3: 4 },
    jaipur: { aqi: 130, status: "Moderate", pm25: 47, pm10: 65, co: 5.0, no2: 34, so2: 15, o3: 15 },
    lucknow: { aqi: 350, status: "Very Poor", pm25: 210, pm10: 280, co: 12.0, no2: 15, so2: 5, o3: 11 }
};

// --- 2. AQI Fetch Logic ---
function fetchCityAQI() {
    const select = document.getElementById('city-select');
    const cityKey = select.value;
    const data = cityData[cityKey];

    document.getElementById('location-display').innerText = select.options[select.selectedIndex].text;
    document.getElementById('aqi-status').innerText = data.status;
    animateValue(document.getElementById('aqi-display'), 0, data.aqi, 1000);

    document.getElementById('pm25-val').innerText = data.pm25;
    document.getElementById('pm10-val').innerText = data.pm10;
    document.getElementById('co-val').innerText = data.co;
    document.getElementById('no2-val').innerText = data.no2;
    document.getElementById('so2-val').innerText = data.so2;
    document.getElementById('o3-val').innerText = data.o3;

    const card = document.getElementById('aqi-card');
    card.style.background = getAQIColor(data.aqi);
}

function getAQIColor(aqi) {
    if(aqi <= 50) return "rgba(46, 204, 113, 0.5)"; 
    if(aqi <= 100) return "rgba(241, 196, 15, 0.5)"; 
    if(aqi <= 200) return "rgba(230, 126, 34, 0.5)"; 
    return "rgba(231, 76, 60, 0.6)"; 
}

// --- 3. Scroll Animation ---
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
        }
    });
});
const hiddenElements = document.querySelectorAll('.hidden');
hiddenElements.forEach((el) => observer.observe(el));

// --- 4. Real-Time Carbon Calculator (WITH SUGGESTIONS) ---
function realTimeCalc() {
    const km = parseFloat(document.getElementById('km-range').value);
    const elec = parseFloat(document.getElementById('elec-range').value);
    const waste = parseFloat(document.getElementById('waste-range').value);

    // Update Text Labels
    document.getElementById('km-val').innerText = km + " km";
    document.getElementById('elec-val').innerText = elec + " kWh";
    document.getElementById('waste-val').innerText = waste + " kg";

    const totalCO2 = (km * 0.12) + (elec * 0.82) + (waste * 0.5);

    // Update Score
    const scoreNum = document.getElementById('score-number');
    scoreNum.innerText = totalCO2.toFixed(1);

    // Dynamic Styling & Suggestions
    const ring = document.getElementById('result-ring');
    const feedback = document.getElementById('feedback-text');
    const tip = document.getElementById('tip-text');

    if (totalCO2 < 5) {
        ring.style.borderTopColor = "#52b788"; 
        ring.style.boxShadow = "0 0 30px rgba(82, 183, 136, 0.5)";
        feedback.innerText = "🌿 Excellent! Keep it up.";
        tip.innerText = "Tip: Plant a tree to become carbon negative!";
    } else if (totalCO2 < 15) {
        ring.style.borderTopColor = "#f1c40f"; 
        ring.style.boxShadow = "0 0 30px rgba(241, 196, 15, 0.5)";
        feedback.innerText = "⚠️ Moderate. Watch usage.";
        tip.innerText = "Tip: Unplug electronics at night to save ~10% energy.";
    } else {
        ring.style.borderTopColor = "#e74c3c"; 
        ring.style.boxShadow = "0 0 40px rgba(231, 76, 60, 0.6)";
        feedback.innerText = "🔥 High Impact! Action needed.";
        tip.innerText = "Tip: Try carpooling or using public transport twice a week.";
    }
}

// Helper: Animate Numbers
function animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        obj.innerHTML = Math.floor(progress * (end - start) + start);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

window.onload = function() {
    fetchCityAQI(); 
};