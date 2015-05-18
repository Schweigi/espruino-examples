I2C1.setup({sda:B7, scl:B6});

var MAX_ENTRIES = 6500;
var MIN_BATV = 3.2;
var INTERVAL_S = 5 * 60;
var TIMEZONE_OFFSET_H = -7; // OFFSET FROM UTC 

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
  
  flashGreenLED();
  historyIndex++;
  
  // Set history timestamp after first measurement
  if (historyTimestamp === undefined) {
    historyTimestamp = Date.now();
  }

  htu.getHumidity(function (x) {
    historyHum[historyIndex-1] = x * 100;
  });

  // Stagger the temperature reading by one second, to prevent a read collision
  setTimeout(function () {
    htu.getTemperature(function (t) { 
      historyTemp[historyIndex-1] = t * 100;
    });
  }, 1000);
}

function generateDateString(i) {
  var d = new Date(historyTimestamp + i*INTERVAL_S*1000 + TIMEZONE_OFFSET_H*3600*1000);
  return (d.getMonth()+1)+"/"+d.getDate()+"/"+d.getFullYear()+" "+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds();
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

setInterval(log, INTERVAL_S*1000);
setWatch(flashGreenLED, BTN, true);
setSleepIndicator(LED1);
setDeepSleep(1);
