import React, { useEffect } from "react";
import "./Weather.css";
import "font-awesome/css/font-awesome.min.css";
import sun from "../Assets/sun.png";
import NewYork from "../Assets/NewYork.jpg";
import delhi from "../Assets/delhi.jpg";
import mumbai from "../Assets/mumbai.jpg";
import bang from "../Assets/bang.jpg";
import defaultt from "../Assets/default.jpg";
import mydp from "../Assets/mydp.jpg";
import { WiWindDeg } from "react-icons/wi";
import {
  FaArrowCircleDown,
  FaArrowCircleUp,
  FaThermometerEmpty,
  FaThermometerThreeQuarters,
} from "react-icons/fa";
import { SemiCircleProgress } from "react-semicircle-progressbar";
import { Data as cities } from "../Data/Data";
export const Weather = () => {
  useEffect(() => {
    const temp = document.getElementById("temp"),
      date = document.getElementById("date-time"),
      condition = document.getElementById("condition"),
      rain = document.getElementById("rain"),
      mainIcon = document.getElementById("icon"),
      locIcon = document.getElementById("loc-icon"),
      currentLocation = document.getElementById("location"),
      uvIndex = document.querySelector(".uv-index"),
      uvText = document.querySelector(".uv-text"),
      windSpeed = document.querySelector(".wind-speed"),
      sunRise = document.querySelector(".sun-rise"),
      sunSet = document.querySelector(".sun-set"),
      humidity = document.querySelector(".humidity"),
      visibilty = document.querySelector(".visibilty"),
      humidityStatus = document.querySelector(".humidity-status"),
      airQuality = document.querySelector(".air-quality"),
      airQualityStatus = document.querySelector(".air-quality-status"),
      visibilityStatus = document.querySelector(".visibilty-status"),
      searchForm = document.querySelector("#search"),
      search = document.querySelector("#query"),
      celciusBtn = document.querySelector(".celcius"),
      fahrenheitBtn = document.querySelector(".fahrenheit"),
      tempUnit = document.querySelectorAll(".temp-unit"),
      hourlyBtn = document.querySelector(".hourly"),
      weekBtn = document.querySelector(".week"),
      weatherCards = document.querySelector("#weather-cards");

    let currentCity = "";
    let currentUnit = "c";
    let hourlyorWeek = "week";

    const getDateTime = () => {
      let now = new Date(),
        hour = now.getHours(),
        minute = now.getMinutes();

      let days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];

      hour = hour % 12;
      if (hour < 10) {
        hour = "0" + hour;
      }
      if (minute < 10) {
        minute = "0" + minute;
      }
      let dayString = days[now.getDay()];
      return `${dayString}, ${hour}:${minute}`;
    };

    date.innerText = getDateTime();
    setInterval(() => {
      date.innerText = getDateTime();
    }, 1000);

    const getPublicIp = () => {
      fetch("https://geolocation-db.com/json/", {
        method: "GET",
        headers: {},
      })
        .then((response) => response.json())
        .then((data) => {
          currentCity = data.city;
          getWeatherData(data.city, currentUnit, hourlyorWeek);
        })
        .catch((err) => {
          console.error(err);
        });
    };

    getPublicIp();

    const getWeatherData = (city, unit, hourlyorWeek) => {
      fetch(
        `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=metric&key=EJ6UBL2JEQGYB3AA4ENASN62J&contentType=json`,
        {
          method: "GET",
          headers: {},
        }
      )
        .then((response) => response.json())
        .then((data) => {
          let today = data.currentConditions;
          if (unit === "c") {
            temp.innerText = today.temp;
          } else {
            temp.innerText = celciusToFahrenheit(today.temp);
          }
          currentLocation.innerText = data.resolvedAddress;
          condition.innerText = today.conditions;
          rain.innerText = "Perc - " + today.precip + "%";
          uvIndex.innerText = today.uvindex;
          windSpeed.innerText = today.windspeed;
          measureUvIndex(today.uvindex);
          mainIcon.src = getIcon(today.icon);
          locIcon.src = getLocIcon(today.locIcon);
          humidity.innerText = today.humidity + "%";
          updateHumidityStatus(today.humidity);
          visibilty.innerText = today.visibility;
          updateVisibiltyStatus(today.visibility);
          airQuality.innerText = today.winddir;
          updateAirQualityStatus(today.winddir);
          if (hourlyorWeek === "hourly") {
            updateForecast(data.days[0].hours, unit, "day");
          } else {
            updateForecast(data.days, unit, "week");
          }
          sunRise.innerText = covertTimeTo12HourFormat(today.sunrise);
          sunSet.innerText = covertTimeTo12HourFormat(today.sunset);
        })
        .catch((err) => {
          //  console.log("City not found in our database");
        });
    };

    const updateForecast = (data, unit, type) => {
      weatherCards.innerHTML = "";
      let day = 0;
      let numCards = 0;
      if (type === "day") {
        numCards = 24;
      } else {
        numCards = 7;
      }
      for (let i = 0; i < numCards; i++) {
        let card = document.createElement("div");
        card.classList.add("card");
        let dayName = getHour(data[day].datetime);
        if (type === "week") {
          dayName = getDayName(data[day].datetime);
        }
        let dayTemp = data[day].temp;
        if (unit === "f") {
          dayTemp = celciusToFahrenheit(data[day].temp);
        }
        let iconCondition = data[day].icon;
        let iconSrc = getIcon(iconCondition);
        
        
        let tempUnit = "°C";
        if (unit === "f") {
          tempUnit = "°F";
        }
        card.innerHTML = `
        <h2 class="day-name">${dayName}</h2>
    <div class="card-icon">
      <img src="${iconSrc}" class="day-icon" alt="" />
    </div>
    <div class="day-temp">
      <h2 class="temp">${dayTemp}</h2>
      <span class="temp-unit">${tempUnit}</span>
    </div>
`;
        weatherCards.appendChild(card);
        day++;
      }
    };

    const getIcon = (condition) => {
      if (condition === "partly-cloudy-day") {
        return "https://i.ibb.co/PZQXH8V/27.png";
      } else if (condition === "partly-cloudy-night") {
        return "https://i.ibb.co/Kzkk59k/15.png";
      } else if (condition === "rain") {
        return "https://i.ibb.co/kBd2NTS/39.png";
      } else if (condition === "clear-day") {
        return "https://i.ibb.co/rb4rrJL/26.png";
      } else if (condition === "clear-night") {
        return "https://i.ibb.co/1nxNGHL/10.png";
      } else {
        return "https://i.ibb.co/rb4rrJL/26.png";
      }
    };
    const getLocIcon = () => {
      if (currentCity == "Mumbai") {
        return mumbai;
      } else if (currentCity == "new york") {
        return NewYork;
      } else if (currentCity == "delhi") {
        return delhi;
      } else if (currentCity == "banglore") {
        return bang;
      } else {
        return defaultt;
      }
    };

    const getHour = (time) => {
      let hour = time.split(":")[0];
      let min = time.split(":")[1];
      if (hour > 12) {
        hour = hour - 12;
        return `${hour}:${min} PM`;
      } else {
        return `${hour}:${min} AM`;
      }
    };

    const covertTimeTo12HourFormat = (time) => {
      let hour = time.split(":")[0];
      let minute = time.split(":")[1];
      let ampm = hour >= 12 ? "pm" : "am";
      hour = hour % 12;
      hour = hour ? hour : 12;
      hour = hour < 10 ? "0" + hour : hour;
      minute = minute < 10 ? "0" + minute : minute;
      let strTime = hour + ":" + minute + " " + ampm;
      return strTime;
    };

    const getDayName = (date) => {
      let day = new Date(date);
      let days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      return days[day.getDay()];
    };

    const measureUvIndex = (uvIndex) => {
      if (uvIndex <= 2) {
        uvText.innerText = "Low";
      } else if (uvIndex <= 5) {
        uvText.innerText = "Moderate";
      } else if (uvIndex <= 7) {
        uvText.innerText = "High";
      } else if (uvIndex <= 10) {
        uvText.innerText = "Very High";
      } else {
        uvText.innerText = "Extreme";
      }
    };

    const updateHumidityStatus = (humidity) => {
      if (humidity <= 30) {
        humidityStatus.innerText = "Low";
      } else if (humidity <= 60) {
        humidityStatus.innerText = "Normal🤙";
      } else {
        humidityStatus.innerText = "High😰";
      }
    };

    const updateVisibiltyStatus = (visibility) => {
      if (visibility <= 0.03) {
        visibilityStatus.innerText = "Dense Fog";
      } else if (visibility <= 0.16) {
        visibilityStatus.innerText = "Moderate Fog";
      } else if (visibility <= 0.35) {
        visibilityStatus.innerText = "Light Fog";
      } else if (visibility <= 1.13) {
        visibilityStatus.innerText = "Very Light Fog";
      } else if (visibility <= 2.16) {
        visibilityStatus.innerText = "Light Mist";
      } else if (visibility <= 5.4) {
        visibilityStatus.innerText = "Very Light Mist🙁";
      } else if (visibility <= 10.8) {
        visibilityStatus.innerText = "Clear Air";
      } else {
        visibilityStatus.innerText = "Very Clear Air";
      }
    };

    const updateAirQualityStatus = (airquality) => {
      if (airquality <= 50) {
        airQualityStatus.innerText = "Good👌";
      } else if (airquality <= 100) {
        airQualityStatus.innerText = "Moderate😐";
      } else if (airquality <= 150) {
        airQualityStatus.innerText = "Unhealthy for Sensitive Groups😷";
      } else if (airquality <= 200) {
        airQualityStatus.innerText = "Unhealthy👎";
      } else if (airquality <= 250) {
        airQualityStatus.innerText = "Very Unhealthy😨";
      } else {
        airQualityStatus.innerText = "Hazardous😱";
      }
    };

    searchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      let location = search.value;
      if (location) {
        currentCity = location;
        getWeatherData(location, currentUnit, hourlyorWeek);
      }
    });

    const celciusToFahrenheit = (temp) => {
      return ((temp * 9) / 5 + 32).toFixed(1);
    };

    var currentFocus;
    search.addEventListener("input", function (e) {
      removeSuggestions();
      var a,
        b,
        i,
        val = this.value;
      if (!val) {
        return false;
      }
      currentFocus = -1;

      a = document.createElement("ul");
      a.setAttribute("id", "suggestions");

      this.parentNode.appendChild(a);

      for (i = 0; i < cities.length; i++) {
        if (
          cities[i].name.substr(0, val.length).toUpperCase() ==
          val.toUpperCase()
        ) {
          b = document.createElement("li");
          b.innerHTML =
            "<strong>" + cities[i].name.substr(0, val.length) + "</strong>";
          b.innerHTML += cities[i].name.substr(val.length);
          b.innerHTML += "<input type='hidden' value='" + cities[i].name + "'>";
          b.addEventListener("click", function (e) {
            search.value = this.getElementsByTagName("input")[0].value;
            removeSuggestions();
          });

          a.appendChild(b);
        }
      }
    });
    search.addEventListener("keydown", function (e) {
      var x = document.getElementById("suggestions");
      if (x) x = x.getElementsByTagName("li");
      if (e.keyCode == 40) {
        currentFocus++;
        addActive(x);
      } else if (e.keyCode == 38) {
        currentFocus--;
        addActive(x);
      }
      if (e.keyCode == 13) {
        e.preventDefault();
        if (currentFocus > -1) {
          if (x) x[currentFocus].click();
        }
      }
    });
    const addActive = (x) => {
      if (!x) return false;
      removeActive(x);
      if (currentFocus >= x.length) currentFocus = 0;
      if (currentFocus < 0) currentFocus = x.length - 1;
      x[currentFocus].classList.add("active");
    };
    const removeActive = (x) => {
      for (var i = 0; i < x.length; i++) {
        x[i].classList.remove("active");
      }
    };

    const removeSuggestions = () => {
      var x = document.getElementById("suggestions");
      if (x) x.parentNode.removeChild(x);
    };

    fahrenheitBtn.addEventListener("click", () => {
      changeUnit("f");
    });
    celciusBtn.addEventListener("click", () => {
      changeUnit("c");
    });

    const changeUnit = (unit) => {
      if (currentUnit !== unit) {
        currentUnit = unit;
        tempUnit.forEach((elem) => {
          elem.innerText = `°${unit.toUpperCase()}`;
        });
        if (unit === "c") {
          celciusBtn.classList.add("active");
          fahrenheitBtn.classList.remove("active");
        } else {
          celciusBtn.classList.remove("active");
          fahrenheitBtn.classList.add("active");
        }
        getWeatherData(currentCity, currentUnit, hourlyorWeek);
      }
    };

    hourlyBtn.addEventListener("click", () => {
      changeTimeSpan("hourly");
    });
    weekBtn.addEventListener("click", () => {
      changeTimeSpan("week");
    });

    const changeTimeSpan = (unit) => {
      if (hourlyorWeek !== unit) {
        hourlyorWeek = unit;
        if (unit === "hourly") {
          hourlyBtn.classList.add("active");
          weekBtn.classList.remove("active");
        } else {
          hourlyBtn.classList.remove("active");
          weekBtn.classList.add("active");
        }
        getWeatherData(currentCity, currentUnit, hourlyorWeek);
      }
    };
  }, []);

  return (
    <div className="wrapper">
      <div className="sidebar">
        <div>
          <form className="search" id="search">
            <i className="fa fa-search"></i>
            <input type="text" id="query" placeholder="Search for places..." />
            <button>
              <i className="fa fa-crosshairs"></i>
            </button>
          </form>
          <div className="weather-icon">
            <img id="icon" src={sun} alt="" />
          </div>
          <div className="temperature">
            <p id="temp">12</p>
            <span className="temp-unit">°C</span>
          </div>
          <div className="date-time">
            <p id="date-time">
              Monday,<span>16:00</span>{" "}
            </p>
          </div>
          <div className="divider"></div>
          <div className="condition-rain">
            <div className="condition">
              <i className="fa fa-cloud"></i>
              <p id="condition">Mostly Cloudy</p>
            </div>
            <div className="rain">
              <i className="fa fa-signal"></i>
              <p id="rain">Rain - 30%</p>
            </div>
          </div>
        </div>
        <div className="location">
          <img id="loc-icon" src={defaultt} alt="" />
          <p id="location">New York, NY, USA</p>
        </div>
      </div>
      <div className="main">
        <nav>
          <ul className="options">
            <button className="hourly">today</button>
            <button className="week active">week</button>
          </ul>
          <ul className="option">
            <button className="celcius active">°C</button>
            <button className="fahrenheit">°F</button>
            <img id="icon" src={mydp} alt="" />
            <div className="hide">Hello Nikhil</div>
          </ul>
        </nav>
        <div className="cards" id="weather-cards"></div>
        <div className="highlights">
          <h2 className="heading">today's highlights</h2>
          <div className="cards">
            <div className="card2">
              <h4 className="card-heading">UV Index</h4>
              <div className="content">
                <SemiCircleProgress
                  percentage={30}
                  size={{
                    width: 190,
                    height: 110,
                  }}
                  strokeWidth={20}
                  strokeColor="#FFBF5E"
                  strokeLinecap="square"
                />
                <p className="uv-index">0</p>
                <p className="uv-text">Low</p>
              </div>
            </div>
            <div className="card2">
              <h4 className="card-heading">Wind Status</h4>
              <div className="content">
                <h1 className="wind-speed">7.70</h1>
                <h6>km/h</h6>
                <p>
                  <WiWindDeg />
                  WSW
                </p>
              </div>
            </div>
            <div className="card2">
              <h4 className="card-heading">Sunrise & Sunset</h4>
              <div className="content">
              <FaArrowCircleUp style={{ fontSize:"30px", color: "#FFDA4D" }} />
                <h3 className="sun-rise">
                 
                  6:35AM
                </h3>
                <FaArrowCircleDown style={{fontSize:"30px", color: "#FFDA4D" }} />
                <h3 className="sun-set">
                  
                  5:42PM
                </h3>
              </div>
            </div>
            <div className="card2">
              <h4 className="card-heading">Humidity</h4>
              <div className="content">
                <p className="humidity">12 </p>
                <p className="humidity-status">Normal</p>

                <div className="measures">
                  <FaThermometerEmpty />
                </div>
              </div>
            </div>
            <div className="card2">
              <h4 className="card-heading">Visibility</h4>
              <div className="content">
                <p className="visibilty">5.2</p>

                <p className="visibilty-status">Average</p>
                <h5>km</h5>
              </div>
            </div>
            <div className="card2">
              <h4 className="card-heading">Air Quality</h4>
              <div className="content">
                <p className="air-quality">105</p>
                <p className="air-quality-status">Unhealthy</p>
                <div className="measures">
                  <FaThermometerThreeQuarters />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};