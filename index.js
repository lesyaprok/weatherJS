//background-image
const unsplashID = '75d70c7a0ebe2b3acc928b6e341b5c8b8d1a4e64beaf37fef3fb7585f4027796';
const d = new Date().getMonth();
const t = new Date().getHours();
let query;

if (d <= 1 || d === 11) {
    query = 'winter';
}
if (d >= 2 && d <= 4) {
    query = 'spring';
}
if (d >= 5 && d <= 7) {
    query = 'summer';
}
if (d >= 8 && d <= 10) {
    query = 'autumn';
}

let query2;
if (t >= 00 && t < 5 || t >= 21) {
    query2 = 'night'
}
if (t >= 5 && t < 12) {
    query2 = 'morning'
}
if (t >= 12 && t < 17) {
    query2 = 'day'
}
if (t >= 17 && t < 21) {
    query2 = 'evening'
}

const url = `https://api.unsplash.com/photos/random?orientation=landscape&per_page=1&query=${query}+${query2}+nature&client_id=${unsplashID}`;
const getImage = document.onload = () => fetch(url).then(res => res.json()).then(data =>
    document.querySelector('body').style.background = `url(${data.urls.regular}) center center / cover no-repeat fixed`);
getImage();

//reload image on click
let reload = document.getElementById('reload');
reload.addEventListener('click', (e) => getImage());

//location

// import {getWeatherOnDay, getWeatherOnThreeDays} from 'weather.js';

function success(position) {
    document.getElementById('latitude').innerText = ConvertDEGToDMS(`${(position.coords.latitude).toFixed(2)}`);
    document.getElementById('longitude').innerText = ConvertDEGToDMS(`${(position.coords.longitude).toFixed(2)}`);
    // console.log(position.coords.latitude, position.coords.longitude)
}
navigator.geolocation.getCurrentPosition(success);

//location
fetch('https://ipinfo.io/json?token=08c63d5703104c').then(res => res.json()).then(data => {
    cityName = data.city,
        document.getElementById('location').innerHTML = `${cityName}, ${data.country}`;
    // cityName = document.getElementById('location').textContent;
    getWeatherOnDay(cityName);
    getWeatherOnThreeDays(cityName);


});


//convert to degrees & minutes
const ConvertDEGToDMS = (deg, lat) => {
    const absolute = Math.abs(deg);
    const degrees = Math.floor(absolute);
    const minutesNotTruncated = (absolute - degrees) * 60;
    const minutes = Math.floor(minutesNotTruncated);
    // const seconds = ((minutesNotTruncated - minutes) * 60).toFixed(2);

    if (lat) {
        const direction = deg >= 0 ? "N" : "S";
    } else {
        const direction = deg >= 0 ? "E" : "W";
    }
    return degrees + "°" + minutes + "'";
}

//geocode
let lat, long;
const getGeoCode = (cityName) => {
    fetch(`https://api.opencagedata.com/geocode/v1/json?q=${cityName}&key=541e04cb4db34cd6ac61480c36ab855b`)
        .then(res => res.json()).then(data => {
            lat = (data.results[0].geometry.lat).toFixed(2),
                long = (data.results[0].geometry.lng).toFixed(2)
            document.getElementById('latitude').innerHTML = ConvertDEGToDMS(`${(data.results[0].geometry.lat).toFixed(2)}`);
            document.getElementById('longitude').innerHTML = ConvertDEGToDMS(`${(data.results[0].geometry.lng).toFixed(2)}`);
        })
}


//search, change data
document.getElementById('search-input').addEventListener('change', (e) => {
    document.getElementById('location').innerHTML = document.getElementById('search-input').value,
        // cityName = document.getElementById('search-input').value,
        cityName = document.getElementById('location').textContent;
    getWeatherOnDay(cityName);
    getWeatherOnThreeDays(cityName);
    getGeoCode(cityName);
    getLocation();
}
)

//map

let cityName;
const daily = `https://api.openweathermap.org/data/2.5/weather?q=cityName&lang=en&units=metric&APPID=7628b84858689e70d784fa009f97eea5`;
const threeDays = `https://api.openweathermap.org/data/2.5/forecast?q=cityName&lang=en&units=metric&APPID=7628b84858689e70d784fa009f97eea5`;

//map
mapboxgl.accessToken = 'pk.eyJ1IjoibGVzeWFwcm9rIiwiYSI6ImNrM3pwMGJxazA2MjYzbW10NTA5YzBtd2MifQ.LxzBp9Ou93eEfYgCMqC4tA';
var map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v11",
    center: [-74.5, 40],
    zoom: 3
});
//zoom, current location
map.addControl(new mapboxgl.NavigationControl());
const control = () => {
    map.addControl(new mapboxgl.GeolocateControl({
        positionOptions: {
            enableHighAccuracy: true
        },
        showUserLocation: true,
        trackUserLocation: true
    }));
}
control()

//geocoder
const mapboxClient = mapboxSdk({ accessToken: mapboxgl.accessToken });
const getLocation = () => {
    mapboxClient.geocoding
        .forwardGeocode({
            query: cityName,
            autocomplete: false,
            limit: 1
        })
        .send()
        .then(function (response) {
            if (
                response &&
                response.body &&
                response.body.features &&
                response.body.features.length
            ) {
                const feature = response.body.features[0];

                const map = new mapboxgl.Map({
                    container: 'map',
                    style: 'mapbox://styles/mapbox/streets-v11',
                    center: feature.center,
                    zoom: 11
                });
                new mapboxgl.Marker().setLngLat(feature.center).addTo(map);
            }
        });
}
// getLocation()


//language

const lang = document.getElementById('language');

lang.addEventListener('change', e => {
    if (e.target.value === 'EN') {
        d1.innerHTML = weekdays.en[getAday + 1],
            d2.innerHTML = weekdays.en[getAday + 2],
            d3.innerHTML = weekdays.en[getAday + 3],
            document.getElementById('h').innerText = 'HUMIDITY: ',
            document.getElementById('w').innerText = 'WIND: ',
            document.getElementById('f').innerText = 'FEELS LIKE: ',
            document.getElementById('ltd').innerText = 'Latitude: ',
            document.getElementById('lng').innerText = 'Longitude: ',
            date.innerHTML = new Date().toLocaleDateString('en-EN', options),
            fetch(daily.replace('cityName', `${cityName}`).replace('lang=ru' || 'lang=be', 'lang=en'))
                .then(res => res.json()).then(data =>
                    document.getElementById('description').innerHTML = (data.weather[0].description).toUpperCase()
                )
    }

    if (e.target.value === 'RU') {
        d1.innerHTML = weekdays.ru[getAday + 1];
        d2.innerHTML = weekdays.ru[getAday + 2];
        d3.innerHTML = weekdays.ru[getAday + 3];
        document.getElementById('h').innerText = 'ВЛАЖНОСТЬ: ',
        document.getElementById('w').innerText = 'ВЕТЕР: ',
        document.getElementById('f').innerText = 'ОЩУЩАЕТСЯ: ',
        document.getElementById('ltd').innerText = 'Широта: ',
        document.getElementById('lng').innerText = 'Долгота: ',
        date.innerHTML = new Date().toLocaleDateString('ru-RU', options),
            fetch(daily.replace('cityName', `${cityName}`).replace('lang=en' || 'lang=be', 'lang=ru'))
                .then(res => res.json()).then(data => {
                    document.getElementById('description').innerHTML = (data.weather[0].description).toUpperCase()
                }
                )
    }
    if (e.target.value === 'BY') {
        d1.innerHTML = weekdays.by[getAday + 1];
        d2.innerHTML = weekdays.by[getAday + 2];
        d3.innerHTML = weekdays.by[getAday + 3];
        document.getElementById('h').innerText = 'ВІЛЬГОТНАСЦЬ: ',
            document.getElementById('w').innerText = 'ВЕЦЕР: ',
            document.getElementById('f').innerText = 'АДЧУВАЕЦЦА: ',
            document.getElementById('ltd').innerText = 'Шырата: ',
            document.getElementById('lng').innerText = 'Даўгата: ',
            date.innerHTML = new Date().toLocaleDateString('ru-RU', options).replace('января', 'студзеня')
                .replace('февраля', 'лютага')
                .replace('марта', 'сакавiка')
                .replace('апреля', 'красавiка')
                .replace('июня', 'чэрвеня')
                .replace('июля', 'лiпеня')
                .replace('августа', 'жніўня')
                .replace('сентября', 'верасня')
                .replace('октября', 'кастрычніка')
                .replace('ноября', 'лістапада')
                .replace('декабря', 'снежня')
                .replace('вт', 'Аў')
                .replace('чт', 'Чц')
                .replace('вс', 'Нд')

        fetch(daily.replace('cityName', `${cityName}`).replace('lang=en' || 'lang=ru', 'lang=ru'))
            .then(res => res.json()).then(data =>
                document.getElementById('description').innerHTML = (data.weather[0].description).toUpperCase()
                    .replace('ЯСНО', 'ЯСНА').replace('ДОЖДЬ', 'ДОЖДЖ').replace('ОБЛАЧНО', 'ВОБЛАЧНА')
                    .replace('ПАСМУРНО', 'ПАХМУРНА').replace(`ПЕРЕМЕННАЯ`, `ПЕРАМЕННАЯ`).replace('ОБЛАЧНОСТЬ', 'ВОБЛАЧНАСЦЬ')
                    .replace('НЕБОЛЬШАЯ', 'НЕВЯЛIКАЯ').replace('НЕБОЛЬШОЙ', 'НЕВЯЛІКІ').replace('СНЕГОПАД', 'СНЕГАПАД')
            )
    }
}
)

//weather

let timezone;
const cel_far = document.getElementById('temperature-buttons');

//current, one day weather
let currentTime = `${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
const getWeatherOnDay = (cityName) => {
    fetch(daily.replace('cityName', `${cityName}`))
        .then(res => res.json()).then(data => {
            let d = new Date();
            let offset = new Date().getTimezoneOffset() / 60 + 3;
            timezoneDiff = (data.timezone / 3600 - 3) - offset;
            timezone = data.timezone;
            currentTime = `${d.getHours() + timezoneDiff <= 23 || d.getHours() + timezoneDiff < 0 ? d.getHours() + timezoneDiff
                : (d.getHours() + timezoneDiff) - 24}:${d.getMinutes() < 10 ? '0' + d.getMinutes() : '' + d.getMinutes()}`;


                document.getElementById('time').innerHTML =
                `${(d.getHours() + timezoneDiff) <= 23 && (d.getHours() + timezoneDiff) >= 0 ? d.getHours() + timezoneDiff
                    : Math.abs(d.getHours() + timezoneDiff - 14)}:${d.getMinutes() < 10 ? '0' + d.getMinutes() : '' + d.getMinutes()}`;
            document.getElementById('description').innerHTML = (data.weather[0].description).toUpperCase(),
            document.getElementById('location').innerHTML = `${data.name}, ${names[data.sys.country]}`,
            document.getElementById('icon').src = `./data/${data.weather[0].icon}.png`,
            document.getElementById('temperature').innerHTML = `${Math.round(data.main.temp)}&#xb0;`,
            document.getElementById('humidity').innerHTML = `${data.main.humidity}%`,
            document.getElementById('wind').innerHTML = `${Math.round(data.wind.speed)} m/s`,
            document.getElementById('feelslike').innerHTML =
                Math.round(- 2.7 + 1.04 * data.main.temp + 2.0 * (data.main.pressure / 1000) - 0.65 * data.wind.speed) + '&#xb0;'
        });

    if (lang.value === 'RU') {
        fetch(daily.replace('cityName', `${cityName}`).replace('lang=en', 'lang=ru'))
            .then(res => res.json()).then(data =>
                document.getElementById('description').innerHTML = (data.weather[0].description).toUpperCase()
            )
    }
    if (lang.value === 'EN') {
        fetch(daily.replace('cityName', `${cityName}`).replace('lang=ru', 'lang=en'))
            .then(res => res.json()).then(data =>
                document.getElementById('description').innerHTML = (data.weather[0].description).toUpperCase()
            )
    }
    if (lang.value === 'BY') {
        fetch(daily.replace('cityName', `${cityName}`).replace('lang=en' || 'lang=ru', 'lang=ru'))
            .then(res => res.json()).then(data =>
                document.getElementById('description').innerHTML = (data.weather[0].description).toUpperCase()
            )
    }
    if (cel_far.value === 'fahrenheit') {
        fetch(daily.replace('cityName', `${cityName}`).replace('metric', 'imperial'))
            .then(res => res.json()).then(data => {
                document.getElementById('temperature').innerHTML = `${Math.round(data.main.temp)}&#xb0;`;
                document.getElementById('feelslike').innerHTML =
                    Math.round(- 2.7 + 1.04 * data.main.temp + 2.0 * (data.main.pressure / 1000) - 0.65 * data.wind.speed) + '&#xb0;'
            })
    }
    if (cel_far.value === 'celsius') {
        fetch(daily.replace('cityName', `${cityName}`).replace('imperial' || 'metric', 'metric'))
            .then(res => res.json()).then(data => {
                document.getElementById('temperature').innerHTML = `${Math.round(data.main.temp)}&#xb0;`;
            })
    }
}


//change C || F
cel_far.addEventListener('change', (e) => {
    if (e.target.value == 'fahrenheit') {
        fetch(daily.replace('cityName', `${cityName}`).replace('metric', 'imperial'))
            .then(res => res.json()).then(data => {
                document.getElementById('temperature').innerHTML = `${Math.round(data.main.temp)}&#xb0;`
            });
        fetch(threeDays.replace('cityName', `${cityName}`).replace('metric', 'imperial'))
            .then(res => res.json()).then(data => {
                const filter_days = data.list.filter(reading => reading.dt_txt.includes("12:00:00"));
                document.getElementById('t1').innerHTML = `${Math.round(filter_days[1].main.temp)}&#xb0;`,
                document.getElementById('t2').innerHTML = `${Math.round(filter_days[2].main.temp)}&#xb0;`,
                document.getElementById('t3').innerHTML = `${Math.round(filter_days[3].main.temp)}&#xb0;`
            })
    }
    if (e.target.value == 'celsius') {
        fetch(daily.replace('cityName', `${cityName}`).replace('imperial', 'metric'))
            .then(res => res.json()).then(data => {
                document.getElementById('temperature').innerHTML = `${Math.round(data.main.temp)}&#xb0;`
            });
        fetch(threeDays.replace('cityName', `${cityName}`).replace('imperial', 'metric'))
            .then(res => res.json()).then(data => {
                const filter_days = data.list.filter(reading => reading.dt_txt.includes("12:00:00"));
                document.getElementById('t1').innerHTML = `${Math.round(filter_days[1].main.temp)}&#xb0;`,
                document.getElementById('t2').innerHTML = `${Math.round(filter_days[2].main.temp)}&#xb0;`,
                document.getElementById('t3').innerHTML = `${Math.round(filter_days[3].main.temp)}&#xb0;`
            })
    }
}
)


//3 days weather

const getWeatherOnThreeDays = (cityName) => {
    fetch(threeDays.replace('cityName', `${cityName}`))
        .then(res => res.json()).then(data => {
            // console.log(data)
            const days = data.list.filter(reading => reading.dt_txt.includes("12:00:00"));
            document.getElementById('t1').innerHTML = `${Math.round(days[1].main.temp)}&#xb0;`,
            document.getElementById('t2').innerHTML = `${Math.round(days[2].main.temp)}&#xb0;`,
            document.getElementById('t3').innerHTML = `${Math.round(days[3].main.temp)}&#xb0;`,
            document.getElementById('t1_icon').src = `data/${days[1].weather[0].icon}.png`,
            document.getElementById('t2_icon').src = `data/${days[2].weather[0].icon}.png`,
            document.getElementById('t3_icon').src = `data/${days[3].weather[0].icon}.png`
        }
        );
    if (cel_far.value === 'fahrenheit') {
        fetch(threeDays.replace('cityName', `${cityName}`).replace('metric' || 'imperial', 'imperial'))
            .then(res => res.json()).then(data => {
                const filter_days = data.list.filter(reading => reading.dt_txt.includes("12:00:00"));
                document.getElementById('t1').innerHTML = `${Math.round(filter_days[1].main.temp)}&#xb0;`,
                document.getElementById('t2').innerHTML = `${Math.round(filter_days[2].main.temp)}&#xb0;`,
                document.getElementById('t3').innerHTML = `${Math.round(filter_days[3].main.temp)}&#xb0;`
            })
    }
    if (cel_far.value === 'celsius') {
        fetch(threeDays.replace('cityName', `${cityName}`).replace('imperial' || 'metric', 'metric'))
            .then(res => res.json()).then(data => {
                const filter_days = data.list.filter(reading => reading.dt_txt.includes("12:00:00"));
                document.getElementById('t1').innerHTML = `${Math.round(filter_days[1].main.temp)}&#xb0;`,
                document.getElementById('t2').innerHTML = `${Math.round(filter_days[2].main.temp)}&#xb0;`,
                document.getElementById('t3').innerHTML = `${Math.round(filter_days[3].main.temp)}&#xb0;`
            })
    }
}

//date_time

const weekdays = {
    en: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday'],
    ru: ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье', 'Понедельник', 'Вторник', 'Среда'],
    by: ['Панядзелак', 'Аўторак', 'Серада', 'Чацьвер', 'Пятніца', 'Субота', 'Нядзеля', 'Панядзелак', 'Аўторак', 'Серада']
}


//setInterval(() => time.innerHTML = `${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit})}`, 0, 60000);
// date.innerHTML = new Date().toDateString();
// const current = () => time.innerHTML = `${currentTime}`;

const current = () => time.innerHTML = `${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
const updateTime = () => {
    current()
    setTimeout(updateTime, 1000 * 60)
}
updateTime();
const options = { weekday: 'short', month: 'long', day: 'numeric' }
date.innerHTML = new Date().toLocaleDateString('en-EN', options);

const d1 = document.getElementById('day1');
const d2 = document.getElementById('day2');
const d3 = document.getElementById('day3');
const getAday = new Date().getDay() - 1;

d1.innerHTML = weekdays.en[getAday + 1];
d2.innerHTML = weekdays.en[getAday + 2];
d3.innerHTML = weekdays.en[getAday + 3];

//spwachRecognition


const microphone = document.getElementById('microphone');
microphone.onclick = () => {
    window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    const recognition = new SpeechRecognition();
    recognition.interimResults = true;
    recognition.lang = 'ru-Ru' || 'en-En';
    // recognition.lang = 'en-En';


    recognition.addEventListener('result', e => {
        document.getElementById('search-input').value = e.results[0][0].transcript,
            cityName = e.results[0][0].transcript,
            document.getElementById('location').innerHTML = document.getElementById('search-input').value
        getWeatherOnDay(cityName);
        getWeatherOnThreeDays(cityName);
        getGeoCode(cityName);
        getLocation();
    })
    // recognition.addEventListener('end', recognition.start);
    recognition.start();
}

const names = {
    "BD": "Bangladesh",
    "BE": "Belgium",
    "BF": "Burkina Faso",
    "BG": "Bulgaria",
    "BA": "Bosnia and Herzegovina",
    "BB": "Barbados",
    "WF": "Wallis and Futuna",
    "BL": "Saint Barthelemy",
    "BM": "Bermuda",
    "BN": "Brunei",
    "BO": "Bolivia",
    "BH": "Bahrain",
    "BI": "Burundi",
    "BJ": "Benin",
    "BT": "Bhutan",
    "JM": "Jamaica",
    "BV": "Bouvet Island",
    "BW": "Botswana",
    "WS": "Samoa",
    "BQ": "Bonaire, Saint Eustatius and Saba ",
    "BR": "Brazil",
    "BS": "Bahamas",
    "JE": "Jersey",
    "BY": "Belarus",
    "BZ": "Belize",
    "RU": "Russia",
    "RW": "Rwanda",
    "RS": "Serbia",
    "TL": "East Timor",
    "RE": "Reunion",
    "TM": "Turkmenistan",
    "TJ": "Tajikistan",
    "RO": "Romania",
    "TK": "Tokelau",
    "GW": "Guinea-Bissau",
    "GU": "Guam",
    "GT": "Guatemala",
    "GS": "South Georgia and the South Sandwich Islands",
    "GR": "Greece",
    "GQ": "Equatorial Guinea",
    "GP": "Guadeloupe",
    "JP": "Japan",
    "GY": "Guyana",
    "GG": "Guernsey",
    "GF": "French Guiana",
    "GE": "Georgia",
    "GD": "Grenada",
    "GB": "United Kingdom",
    "GA": "Gabon",
    "SV": "El Salvador",
    "GN": "Guinea",
    "GM": "Gambia",
    "GL": "Greenland",
    "GI": "Gibraltar",
    "GH": "Ghana",
    "OM": "Oman",
    "TN": "Tunisia",
    "JO": "Jordan",
    "HR": "Croatia",
    "HT": "Haiti",
    "HU": "Hungary",
    "HK": "Hong Kong",
    "HN": "Honduras",
    "HM": "Heard Island and McDonald Islands",
    "VE": "Venezuela",
    "PR": "Puerto Rico",
    "PS": "Palestinian Territory",
    "PW": "Palau",
    "PT": "Portugal",
    "SJ": "Svalbard and Jan Mayen",
    "PY": "Paraguay",
    "IQ": "Iraq",
    "PA": "Panama",
    "PF": "French Polynesia",
    "PG": "Papua New Guinea",
    "PE": "Peru",
    "PK": "Pakistan",
    "PH": "Philippines",
    "PN": "Pitcairn",
    "PL": "Poland",
    "PM": "Saint Pierre and Miquelon",
    "ZM": "Zambia",
    "EH": "Western Sahara",
    "EE": "Estonia",
    "EG": "Egypt",
    "ZA": "South Africa",
    "EC": "Ecuador",
    "IT": "Italy",
    "VN": "Vietnam",
    "SB": "Solomon Islands",
    "ET": "Ethiopia",
    "SO": "Somalia",
    "ZW": "Zimbabwe",
    "SA": "Saudi Arabia",
    "ES": "Spain",
    "ER": "Eritrea",
    "ME": "Montenegro",
    "MD": "Moldova",
    "MG": "Madagascar",
    "MF": "Saint Martin",
    "MA": "Morocco",
    "MC": "Monaco",
    "UZ": "Uzbekistan",
    "MM": "Myanmar",
    "ML": "Mali",
    "MO": "Macao",
    "MN": "Mongolia",
    "MH": "Marshall Islands",
    "MK": "Macedonia",
    "MU": "Mauritius",
    "MT": "Malta",
    "MW": "Malawi",
    "MV": "Maldives",
    "MQ": "Martinique",
    "MP": "Northern Mariana Islands",
    "MS": "Montserrat",
    "MR": "Mauritania",
    "IM": "Isle of Man",
    "UG": "Uganda",
    "TZ": "Tanzania",
    "MY": "Malaysia",
    "MX": "Mexico",
    "IL": "Israel",
    "FR": "France",
    "IO": "British Indian Ocean Territory",
    "SH": "Saint Helena",
    "FI": "Finland",
    "FJ": "Fiji",
    "FK": "Falkland Islands",
    "FM": "Micronesia",
    "FO": "Faroe Islands",
    "NI": "Nicaragua",
    "NL": "Netherlands",
    "NO": "Norway",
    "NA": "Namibia",
    "VU": "Vanuatu",
    "NC": "New Caledonia",
    "NE": "Niger",
    "NF": "Norfolk Island",
    "NG": "Nigeria",
    "NZ": "New Zealand",
    "NP": "Nepal",
    "NR": "Nauru",
    "NU": "Niue",
    "CK": "Cook Islands",
    "XK": "Kosovo",
    "CI": "Ivory Coast",
    "CH": "Switzerland",
    "CO": "Colombia",
    "CN": "China",
    "CM": "Cameroon",
    "CL": "Chile",
    "CC": "Cocos Islands",
    "CA": "Canada",
    "CG": "Republic of the Congo",
    "CF": "Central African Republic",
    "CD": "Democratic Republic of the Congo",
    "CZ": "Czech Republic",
    "CY": "Cyprus",
    "CX": "Christmas Island",
    "CR": "Costa Rica",
    "CW": "Curacao",
    "CV": "Cape Verde",
    "CU": "Cuba",
    "SZ": "Swaziland",
    "SY": "Syria",
    "SX": "Sint Maarten",
    "KG": "Kyrgyzstan",
    "KE": "Kenya",
    "SS": "South Sudan",
    "SR": "Suriname",
    "KI": "Kiribati",
    "KH": "Cambodia",
    "KN": "Saint Kitts and Nevis",
    "KM": "Comoros",
    "ST": "Sao Tome and Principe",
    "SK": "Slovakia",
    "KR": "South Korea",
    "SI": "Slovenia",
    "KP": "North Korea",
    "KW": "Kuwait",
    "SN": "Senegal",
    "SM": "San Marino",
    "SL": "Sierra Leone",
    "SC": "Seychelles",
    "KZ": "Kazakhstan",
    "KY": "Cayman Islands",
    "SG": "Singapore",
    "SE": "Sweden",
    "SD": "Sudan",
    "DO": "Dominican Republic",
    "DM": "Dominica",
    "DJ": "Djibouti",
    "DK": "Denmark",
    "VG": "British Virgin Islands",
    "DE": "Germany",
    "YE": "Yemen",
    "DZ": "Algeria",
    "US": "United States",
    "UY": "Uruguay",
    "YT": "Mayotte",
    "UM": "United States Minor Outlying Islands",
    "LB": "Lebanon",
    "LC": "Saint Lucia",
    "LA": "Laos",
    "TV": "Tuvalu",
    "TW": "Taiwan",
    "TT": "Trinidad and Tobago",
    "TR": "Turkey",
    "LK": "Sri Lanka",
    "LI": "Liechtenstein",
    "LV": "Latvia",
    "TO": "Tonga",
    "LT": "Lithuania",
    "LU": "Luxembourg",
    "LR": "Liberia",
    "LS": "Lesotho",
    "TH": "Thailand",
    "TF": "French Southern Territories",
    "TG": "Togo",
    "TD": "Chad",
    "TC": "Turks and Caicos Islands",
    "LY": "Libya",
    "VA": "Vatican",
    "VC": "Saint Vincent and the Grenadines",
    "AE": "United Arab Emirates",
    "AD": "Andorra",
    "AG": "Antigua and Barbuda",
    "AF": "Afghanistan",
    "AI": "Anguilla",
    "VI": "U.S. Virgin Islands",
    "IS": "Iceland",
    "IR": "Iran",
    "AM": "Armenia",
    "AL": "Albania",
    "AO": "Angola",
    "AQ": "Antarctica",
    "AS": "American Samoa",
    "AR": "Argentina",
    "AU": "Australia",
    "AT": "Austria",
    "AW": "Aruba",
    "IN": "India",
    "AX": "Aland Islands",
    "AZ": "Azerbaijan",
    "IE": "Ireland",
    "ID": "Indonesia",
    "UA": "Ukraine",
    "QA": "Qatar",
    "MZ": "Mozambique"
}