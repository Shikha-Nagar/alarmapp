let hh = document.getElementById("hh");
let mm = document.getElementById("mm");
let meridian = document.getElementById("meridian");

hh.value = new Date().getHours();
mm.value = new Date().getMinutes();
if (hh.value >= 12) {
  meridian.innerText = "PM";
  hh.value %= 12;
  if (hh.value % 12 == 0) {
    hh.value = Number(hh.value) + 12;
  }
}

let alarms = localStorage.getItem("alarms");
if (alarms == null) alarms = new Array();
else alarms = JSON.parse(alarms);
let soundPlaying = false;

function alter(what, value) {
  value = parseInt(value);
  if (what == "h") {
    hh.value = parseInt(hh.value) + value + 12;
    hh.value %= 12;
    if (hh.value <= 0) hh.value = 12;
  } else if (what == "m") {
    mm.value = parseInt(mm.value) + value + 60;
    mm.value %= 60;
  } else {
    if (meridian.innerText == "PM") meridian.innerText = "AM";
    else if (meridian.innerText == "AM") meridian.innerText = "PM";
  }
}

function insert(alarms, newa) {
  alarms.push(newa);
  let i = alarms.length - 1;
  while (i > 0) {
    if (
      alarms[i - 1].h < newa.h ||
      (alarms[i - 1].h == newa.h && alarms[i - 1].m < newa.m)
    ) {
      break;
    }
    let temp = alarms[i - 1];
    alarms[i - 1] = alarms[i];
    alarms[i] = temp;
    i--;
  }
  return alarms;
}

function toggle(index) {
  console.log(alarms[index].active);
  alarms[index].active = !alarms[index].active;
  console.log(alarms[index].active);
  show();
}

function deleteAlarm(index) {
  alarms.splice(index, 1);
  show();
  localStorage.setItem("alarms", JSON.stringify(alarms));
}

function show() {
  let html = ``;
  alarms.forEach((alarm, index) => {
    // html += `<li>hour:${alarm.h} minutes:${alarm.m}</li>`
    let thismeri = "AM";
    if (alarm.h >= 12) thismeri = "PM";
    let thishh = alarm.h % 12;
    if (thishh % 12 == 0) thishh += 12;
    if (alarm.active == null) alarm.active = true;
    html += `
            <div id="alarm-${index}" class="alarms">
                <div class="toggle" id="toggle-${index}"   onclick='toggle(${index})'>
                    <div class="toggle-switch toggle-enabled-${alarm.active}" id="toggle-switch-${index}"></div>
                </div>
                <div class="time">${thishh}:${alarm.m} ${thismeri}</div>
                <div id="close1" class="close" onclick='deleteAlarm(${index})'>&Cross;</div>
            </div>
        `;
  });
  document.getElementById("all-alarms").innerHTML = html;
}

function sync() {
  let time = new Date();
  let h = time.getHours();
  let m = time.getMinutes();
  let s = time.getSeconds();
  let meri = h >= 12 ? " PM" : " AM";
  h %= 12;
  document.getElementById("active-time").innerText =
    h + " : " + m + " : " + s + meri;

  alarms.forEach((alarm, index) => {
    if (
      !soundPlaying &&
      time.getHours() == alarm.h &&
      time.getMinutes() == alarm.m &&
      alarm.active
    ) {
      playSound(index);
    }
  });
  show();
}
const addAlarm = (e) => {
  let newAlarm = {
    h: Number(hh.value),
    m: Number(mm.value),
    active: true,
  };
  if (meridian.innerText == "PM") newAlarm.h += 12;
  if (newAlarm.h % 12 == 0) newAlarm.h -= 12;
  for (alarm of alarms) {
    if (alarm.h == newAlarm.h && alarm.m == newAlarm.m) {
      return;
    }
    if (alarm.h > newAlarm.h || (alarm.h == newAlarm.h && alarm.m > newAlarm.m))
      break;
  }
  alarms = insert(alarms, newAlarm);
  localStorage.setItem("alarms", JSON.stringify(alarms));
  show();
  console.log(newAlarm);
  console.log("Alarms succesfully added");
};

document.getElementById("alarm-form").onsubmit = addAlarm;
// document.getElementById("add").addEventListener("click", addAlarm);

let playSound = (i) => {
  console.log("Playing");
  document.querySelector(".active-alarm-container").style.display = "flex";
  // let mysound = new Audio("http://commondatastorage.googleapis.com/codeskulptor-demos/riceracer_assets/music/lose.ogg");
  let mysound = new Audio("sounds/lose.ogg");
  mysound.play();
  soundPlaying = true;
  document.querySelector(".button-stop").addEventListener("click", () => {
    alarms[i].active = false;
    localStorage.setItem("alarms", JSON.stringify(alarms));
    mysound.pause();
    document.querySelector(".active-alarm-container").style.display = "none";
    soundPlaying = false;
  });
  document.querySelector(".button-snooze").addEventListener("click", () => {
    let { m, h } = alarms[i];
    console.log(h, m);
    m += 5;
    h += m >= 60;
    m = m % 60;
    h = h % 24;
    console.log(h, m);
    alarms[i].m = m;
    alarms[i].h = h;
    localStorage.setItem("alarms", JSON.stringify(alarms));
    mysound.pause();
    document.querySelector(".active-alarm-container").style.display = "none";
    soundPlaying = false;
  });

  localStorage.setItem("alarms", JSON.stringify(alarms));
};

show();
sync();
setInterval(sync, 500);
