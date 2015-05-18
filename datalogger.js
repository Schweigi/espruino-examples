I2C1.setup({sda:B7, scl:B6});

var MAX_ENTRIES = 6500;
var MIN_BATV = 3.2;
var INTERVAL_MS = 5 * 60 * 1000;

var historyIndex = 0;
var historyTimestamp;
var historyTemp = new Int16Array(MAX_ENTRIES);
var historyHum = new Int16Array(MAX_ENTRIES);
var htu = require('HTU21D').connect(I2C1);

function flashGreenLED() {
  digitalWrite(LED2, 1);
  setTimeout(function() {
    digitalWrite(LED2, 0);
  }, 1000);
}

function getBatteryLevel() {
  return E.getAnalogVRef();
}

function checkBatteryLevel(v) {
  if (v < MIN_BATV) {
    digitalWrite(LED1, 1);
    return false;
  } else {
    return true;
  }
}

function checkHistoryLimit() {
  if (historyIndex >= MAX_ENTRIES) {
    digitalWrite(LED1, 1);
    return false;
  } else {
    return true;
  }
}

function log() {
  var batV = getBatteryLevel();
  if (!checkBatteryLevel(batV)) {
    return;
  }

  if (!checkHistoryLimit()) {
    return;
  }
  
  htu.getHumidity(function (x) {
    historyHum[historyIndex] = x * 100;
  });

  // Stagger the temperature reading by one second, to prevent conflict
  setTimeout(function () {
    htu.getTemperature(function (t) { 
      historyTemp[historyIndex] = t * 100;

      // Set history timestamp only after first succesfull measurement
      if (historyTimestamp === undefined) {
        historyTimestamp = Date.now();
      }

      historyIndex += 1;
      flashGreenLED();
    });
  }, 1000);
}

function generateDateString(i) {
  var d = new Date(historyTimestamp + i * INTERVAL_MS);
  return d.getMonth()+"/"+d.getDate()+"/"+d.getFullYear()+" "+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds();
}

function output() {
  console.log("History:");
  console.log("Index\tDate\tTemperature [°C]\tHumidity [%]");
  for(var i=0; i<historyIndex; i++) {
    var date = generateDateString(i);
    var temp = historyTemp[i]/100;
    var hum = historyHum[i]/100;
    
    console.log(i + "\t" + date + "\t" + temp + "\t" + hum);
  }
}

setInterval(log, INTERVAL_MS);
setWatch(flashGreenLED, BTN, true);
setSleepIndicator(LED1);
setDeepSleep(1);
