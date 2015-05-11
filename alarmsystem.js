var ALERT_COOLDOWN = 60 * 1000;
var WIFI_SSID = "<WIFI_SSID>";
var WIFI_PW = "<WIFI_PW>";
var MANDRILL_KEY = "<MANDRIL_API_KEY>";
var FROM_EMAIL = "example@mandrillapp.com";
var TO_EMAIL = "<YOUR EMAIL>";
var ALERT_PLACE = "Livingroom";
 
function buildEmailContent(currentTime) {
  var content = JSON.stringify({
    "key": MANDRILL_KEY,
    "template_name": "intruder-alert",
    "template_content": [
      {
        "name": "alertTime",
        "content": currentTime.toString()
      },
      {
        "name": "alertPlace",
        "content": ALERT_PLACE
      }
    ],
    "message": {
      "from_email": FROM_EMAIL,
      "to": [
        {
          "email": TO_EMAIL,
          "type": "to"
        }
      ]
    }
  });
  
  return content;
}

function sendEmail(content) {
  var options = {
    host: 'mandrillapp.com',
    port: '80',
    path:'/api/1.0/messages/send-template.json',
    method:'POST',
    headers: { 
      "Content-Type": "application/json",
      "Content-Length": content.length
    }
  };

  var req = require("http").request(options, function(res)  {
    console.log("***> HTTP response code: " + res.statusCode);

    var responseData = "";
    res.on('data', function(data) {
      responseData += data;
    });

    res.on('close', function(data) {
      console.log("***> HTTP response: " + responseData);
      console.log("***> HTTP connection closed");
    });
  });

  req.end(content);
}

function enableMovementDetectedLED() {
  digitalWrite(LED2, 1);
}

function disableMovementDetectedLED() {
  digitalWrite(LED2, 0);
}

function flashSurveillanceStartedLED() {
  var intervalId = setInterval("digitalWrite(LED2,l=!l);", 200);
  setTimeout(function() {
    clearInterval(intervalId);
    digitalWrite(LED2, 0);
  }, 2000);  
}


function flashErrorLED() {
  setInterval("digitalWrite(LED1,l=!l);", 200);
}

function flashAlertSentLED() {
  var intervalId = setInterval("digitalWrite(LED1,l=!l);", 200);
  setTimeout(function() {
    clearInterval(intervalId);
    digitalWrite(LED1, 0);
  }, 1200);  
}

var lastAlertTimestamp;
function triggerAlert() {
  var currentTimestamp = Date.now();
  
  if (lastAlertTimestamp === undefined ||
      lastAlertTimestamp + ALERT_COOLDOWN < currentTimestamp) {
    lastAlertTimestamp = currentTimestamp;
    
    var currentTime = new Date();
    var content = buildEmailContent(currentTime);
    sendEmail(content);
    console.log("Alert sent: " + currentTime.toString());
    flashAlertSentLED();
  }
}

function startSurveillance() {
  console.log("Start surveillance...");
  flashSurveillanceStartedLED();
  
  setWatch(function() {
    enableMovementDetectedLED();
    triggerAlert();  
  }, A8, {repeat:true, edge:"rising"});

  setWatch(function() {
    disableMovementDetectedLED();
  }, A8, {repeat:true, edge:"falling"});
}

try {
  Serial2.setup(9600, { rx: A3, tx : A2 });
  
  console.log("Init wifi module...");
  var wifi = require("ESP8266WiFi").connect(Serial2, function(err) {
    if (err) throw err;

    wifi.getVersion(function(err, version) {
      console.log("WiFi chip version: " + version);
    });
    
    wifi.reset(function(err) {
      if (err) throw err;

      console.log("Connecting to wifi network: " + WIFI_SSID);
      wifi.connect(WIFI_SSID, WIFI_PW, function(err) {
        if (err) throw err;

        console.log("Connected");
        startSurveillance();
      });
    });
  });
} catch(err) {
  flashErrorLED();
  console.log(err);
}
