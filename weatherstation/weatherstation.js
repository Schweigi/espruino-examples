I2C1.setup({sda:B7, scl:B6});
Serial2.setup(9600, { rx: A3, tx : A2 });

var PAGE = "<!DOCTYPE html><html><head><meta charset=\"utf-8\"><title>Weather Station WebUI</title><style>\n.rGauge-val,.vGauge-val{font-weight:700;font-size:1.3em}.rGauge{width:200px;height:145px}.rGauge-base{stroke:#edebeb;fill:none}.rGauge-progress{fill:none}.rGauge-max-val,.rGauge-min-val{fill:#b3b3b3}.vGauge{width:145px;height:145px}.vGauge-base{fill:#edebeb}.vGauge-max-val,.vGauge-min-val{fill:#b3b3b3}\n</style><style>\n.gauge,.gauge-section{display:inline-block}.btn,body{color:#333}.btn,.btn:active{text-decoration:none}body{margin:0;padding:20px;font-family:\"Helvetica Neue\",Helvetica,Arial,sans-serif;font-size:14px;line-height:1.42857143;background-color:#fff}.gauge-section{text-align:center}.gauge-section h3{margin-bottom:0}.actions{margin-top:15px}.btn{border:0;border-radius:3px;box-shadow:0 1px 3px #666;background:#fff;padding:10px 20px;cursor:pointer}.btn-icon{padding:2px 15px}.btn:active{background:#ddd}\n</style></head><body><h1>Weather Station</h1><div><div class=\"gauge-section\"><h3>Humidity</h3><div id=\"hum\" class=\"gauge\"></div></div><div class=\"gauge-section\"><h3>Temperature</h3><div id=\"temp\" class=\"gauge\"></div></div></div><div class=\"actions\"><button id=\"refresh\" class=\"btn btn-icon\"><svg height=\"30\" viewbox=\"0 0 24 24\" width=\"30\"><path d=\"M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z\"><path d=\"M0 0h24v24H0z\" fill=\"none\"></svg></button></div><script type=\"text/javascript\">\nfunction createRadGauge(t,e,a,n){function r(t,e,a,n){return{x:t+a*Math.cos(n),y:e+a*Math.sin(n)}}function s(t,e,a,n,s,o){var d=r(t,e,a,-Math.PI),l=r(t,e,a,-Math.PI*(1-1/(o-s)*(n-s))),i=[\"M\",d.x,d.y,\"A\",a,a,0,0,1,l.x,l.y].join(\" \");return i}var o='<svg class=\"rGauge\" viewBox=\"0 0 200 145\"><path class=\"rGauge-base\" id=\"'+t+'_base\" stroke-width=\"30\" /><path class=\"rGauge-progress\" id=\"'+t+'_progress\" stroke-width=\"30\" stroke=\"#1565c0\" /><text class=\"rGauge-val\" id=\"'+t+'_val\" x=\"100\" y=\"105\" text-anchor=\"middle\"></text><text class=\"rGauge-min-val\" id=\"'+t+'_minVal\" x=\"40\" y=\"125\" text-anchor=\"middle\"></text><text class=\"rGauge-max-val\" id=\"'+t+'_maxVal\" x=\"160\" y=\"125\" text-anchor=\"middle\"></text></svg>';document.getElementById(t).innerHTML=o,document.getElementById(t+\"_base\").setAttribute(\"d\",s(100,100,60,1,0,1)),document.getElementById(t+\"_progress\").setAttribute(\"d\",s(100,100,60,e,e,a)),document.getElementById(t+\"_minVal\").textContent=e,document.getElementById(t+\"_maxVal\").textContent=a;var d={setVal:function(r){return r=Math.max(e,Math.min(r,a)),document.getElementById(t+\"_progress\").setAttribute(\"d\",s(100,100,60,r,e,a)),document.getElementById(t+\"_val\").textContent=r+(void 0!==n?n:\"\"),d},setColor:function(e){return document.getElementById(t+\"_progress\").setAttribute(\"stroke\",e),d}};return d}function createVerGauge(t,e,a,n){var r='<svg class=\"vGauge\" viewBox=\"0 0 145 145\"><rect class=\"vGauge-base\" id=\"'+t+'_base\" x=\"30\" y=\"25\" width=\"30\" height=\"100\"></rect><rect class=\"vGauge-progress\" id=\"'+t+'_progress\" x=\"30\" y=\"25\" width=\"30\" height=\"0\" fill=\"#1565c0\"></rect><text class=\"vGauge-val\" id=\"'+t+'_val\" x=\"70\" y=\"80\" text-anchor=\"start\"></text><text class=\"vGauge-min-val\" id=\"'+t+'_minVal\" x=\"70\" y=\"125\"></text><text class=\"vGauge-max-val\" id=\"'+t+'_maxVal\" x=\"70\" y=\"30\" text-anchor=\"start\"></text></svg>';document.getElementById(t).innerHTML=r,document.getElementById(t+\"_minVal\").textContent=e,document.getElementById(t+\"_maxVal\").textContent=a;var s={setVal:function(r){r=Math.max(e,Math.min(r,a));var o=100/(a-e)*(r-e);return document.getElementById(t+\"_progress\").setAttribute(\"height\",o),document.getElementById(t+\"_progress\").setAttribute(\"y\",25+(100-o)),document.getElementById(t+\"_val\").textContent=r+(void 0!==n?n:\"\"),s},setColor:function(e){return document.getElementById(t+\"_progress\").setAttribute(\"fill\",e),s}};return s}\n</script><script type=\"text/javascript\">\nfunction getTempColor(e){return e>=35?\"#ff5722\":e>=30?\"#ff9800\":e>=25?\"#ffc107\":e>=18?\"#4caf50\":e>10?\"#8bc34a\":e>=5?\"#00bcd4\":e>=-5?\"#03a9f4\":\"#2196f3\"}function getHumColor(e){var t=[\"#E3F2FD\",\"#BBDEFB\",\"#90CAF9\",\"#64B5F6\",\"#42A5F5\",\"#2196F3\",\"#1E88E5\",\"#1976D2\",\"#1565C0\",\"#0D47A1\",\"#0D47A1\"];return t[Math.round(e/10)]}function refresh(){var e=new XMLHttpRequest;e.onreadystatechange=function(){if(e.readyState==XMLHttpRequest.DONE)if(200==e.status){var t=JSON.parse(e.responseText);tempGauge.setVal(t.temp).setColor(getTempColor(t.temp)),humGauge.setVal(t.hum).setColor(getHumColor(t.hum))}else console.log(\"Refresh failed: \"+e.status)},e.open(\"GET\",\"data\",!0),e.send()}var tempGauge=createVerGauge(\"temp\",-20,60,\" \xc2\xb0C\").setVal(0).setColor(getTempColor(0)),humGauge=createRadGauge(\"hum\",0,100,\"%\").setVal(0).setColor(getHumColor(0));document.getElementById(\"refresh\").addEventListener(\"click\",refresh),setTimeout(refresh,100);\n</script></body></html>";

var WIFI_NAME = '<ssid>';
var WIFI_PASS = '<password>';
var READ_INTERVAL_S = 5;
var PORT = 80;
var HTTP_OK = 200;
var HTTP_NOTFOUND = 404;

var lastTemp = 0;
var lastHum = 0;
var wifi = require('ESP8266WiFi');
var htu = require('HTU21D').connect(I2C1);

function flashLED(led) {
  digitalWrite(led, 1);
  setTimeout(function() {
    digitalWrite(led, 0);
  }, 1000);
}

setInterval(function() {
  flashLED(LED1);

  htu.getHumidity(function (x) {
    lastHum = Math.round(x*10)/10;
  });

  // Stagger the temperature reading by one second, to prevent a read collision
  setTimeout(function () {
    htu.getTemperature(function (t) { 
      lastTemp = Math.round(t*10)/10;
    });
  }, 1000);
}, READ_INTERVAL_S*1000);

function pageHandler(req, res) {
  flashLED(LED2);

  var reqUrl = url.parse(req.url, true);
  
  if (reqUrl.pathname === '/' && 
      req.method === 'GET') {
    res.writeHead(HTTP_OK, {'Content-Type': 'text/html'});
    res.end(PAGE);
  } else if (reqUrl.pathname === '/data' && 
             req.method === 'GET') {
    var data = {
      temp: lastTemp,
      hum: lastHum
    };
    
    res.writeHead(HTTP_OK, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(data));
  } else {
    res.writeHead(HTTP_NOTFOUND);
    res.end("Not found");
  }
}

var con = wifi.connect(Serial2, function(err) {
  if (err) throw err;
  
  con.reset(function(err) {
    if (err) throw err;
    
    console.log("Connecting to WiFi");
    con.connect(WIFI_NAME, WIFI_PASS, function(err) {
      if (err) throw err;
      
      console.log("Connected");
      con.getIP(function(err, ip) { console.log(ip); });

      require("http").createServer(pageHandler).listen(PORT);
    });
  });
});