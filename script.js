const hour            = document.getElementById('hour');
const min             = document.getElementById('min');
const sec             = document.getElementById('sec');
const digitalTime     = document.getElementById('digitalTime');
const dateDisplay     = document.getElementById('dateDisplay');
const locationDisplay = document.getElementById('locationDisplay');

// Generate 60 tick marks (major every 5, minor otherwise)
const ticksContainer = document.getElementById('ticks');
for (let i = 0; i < 60; i++) {
    const tick = document.createElement('div');
    tick.className = 'tick' + (i % 5 === 0 ? ' major' : ' minor');
    tick.style.transform = `rotate(${i * 6}deg)`;
    ticksContainer.appendChild(tick);
}

const DAYS   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function pad(n) {
    return String(n).padStart(2, '0');
}

function displayTime() {
    const date = new Date();
    const hh   = date.getHours();
    const mm   = date.getMinutes();
    const ss   = date.getSeconds();

    hour.style.transform = `rotate(${30 * hh + mm / 2}deg)`;
    min.style.transform  = `rotate(${6 * mm}deg)`;
    sec.style.transform  = `rotate(${6 * ss}deg)`;

    digitalTime.textContent = `${pad(hh)}:${pad(mm)}:${pad(ss)}`;
    dateDisplay.textContent =
        `${DAYS[date.getDay()]}, ${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

displayTime();
setInterval(displayTime, 1000);

// ── Geolocation + reverse geocoding ──────────────────────────────────────────
function showTimezone() {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    locationDisplay.textContent = tz.split('/').pop().replace(/_/g, ' ');
}

function initLocation() {
    if (!navigator.geolocation) { showTimezone(); return; }

    navigator.geolocation.getCurrentPosition(
        async ({ coords }) => {
            try {
                const res = await fetch(
                    `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${coords.latitude}&longitude=${coords.longitude}&localityLanguage=en`
                );
                const data = await res.json();
                const city    = data.city || data.locality || data.principalSubdivision || '';
                const country = data.countryName || '';
                if (city || country) {
                    locationDisplay.textContent = city ? `${city}, ${country}` : country;
                } else {
                    showTimezone();
                }
            } catch {
                showTimezone();
            }
        },
        showTimezone
    );
}

initLocation();