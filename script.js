const dt = new Date();
// document.getElementById('inputAlarm').setAttribute('min',`${dt.getHours}:${dt.getMinutes}:${dt.getSeconds}`);

const setAlarm = document.getElementById("setAlarmBtn");

setAlarm.addEventListener("click", function () {
  myFunc();
});

function myFunc() {
  const time = document.getElementById("inputAlarm").value;
  if (time == "") alert("Enter a time to set alarm");
  else {
    const newalarm = document.createElement("div");
    const newtime = document.createElement("div");
    const newcheckbox = document.createElement("input");
    const label = document.createElement("label");
    const br = document.createElement("br");

    newcheckbox.setAttribute("type", "checkbox");
    newalarm.classList.add("alarm");
    newtime.classList.add("time");
    newcheckbox.classList.add("button");

    newtime.innerHTML = time;
    newcheckbox.setAttribute("checked", "");
    label.innerText = document.getElementById("alert-text").value;
    // label.style.setProperty("font-size","auto");
    const alarmContainer = document.getElementById("list");
    alarmContainer.appendChild(newalarm);

    newalarm.append(newtime);
    // newalarm.append(br);
    newalarm.append(label);
    newalarm.append(newcheckbox);
    console.log("label", label);

    appendAlarm();
  }
}

function appendAlarm() {
  const list = document.querySelectorAll(".alarm");

  list.forEach((alarm) => {
    // console.log("button value:",alarm.querySelector(".button").value);
    if (alarm.querySelector(".button").value == "on") {
      alarm.querySelector(".button").value = "off";
      const alarmTime = alarm.querySelector(".time").innerText;
      const t = new Date();
      const currentTime = t.toLocaleTimeString("en-GB");

      const timeDifference = timeDiff(alarmTime, currentTime);
      // console.log("time diffreence: ",timeDifference);

      setTimeout(function () {
        ringAlarm();
      }, timeDifference);
      // alarm.remove(); //remove alarm
    }
  });
}

function ringAlarm() {
  document
    .getElementById("container")
    .style.setProperty("filter", "blur(50px)");
  document.getElementById("alert").innerHTML = `${
    document.getElementById("alert-text").value == ""
      ? "Hey I'm here to remind you"
      : document.getElementById("alert-text").value
  }`;
  document.getElementById("ringAlarm").style.display = "grid";

  document.getElementById("okay").addEventListener("click", function () {
    document.getElementById("ringAlarm").style.display = "none";
    document
      .getElementById("container")
      .style.setProperty("filter", "blur(0px)");
  });

  document.getElementById("snooze").addEventListener("click", function () {
    document.getElementById("ringAlarm").style.display = "none";
    document
      .getElementById("container")
      .style.setProperty("filter", "blur(0px)");

    const snoozeTime = document.getElementById("snoozetime").value;
    setTimeout(() => {
      ringAlarm();
    }, snoozeTime * 60 * 1000);
  });
}

function timeDiff(t1, t2) {
  var hDiff = Number(t1.substring(0, 2)) - Number(t2.substring(0, 2));
  hDiff = hDiff < 0 ? hDiff + 24 : hDiff;
  console.log("hdiff", hDiff);
  const mDiff = Number(t1.substring(3, 5)) - Number(t2.substring(3, 5));
  const sDiff = Number(t1.substring(6, 8)) - Number(t2.substring(6, 8));
  return (hDiff * 3600 + mDiff * 60 + sDiff) * 1000;
}

function uncheck() {
  let alarms = document.querySelectorAll(".alarm");
  alarms.forEach((alarm) => {
    const btn = alarm.querySelector(".button");
    btn.addEventListener("click", function () {
      if (btn.hasAttribute("checked")) alarm.remove();
    });
  });
}

function removeAlarm(alarm) {
  alarm.remove();
  // clearTimeout(timeout);
}
