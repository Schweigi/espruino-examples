function createRadGauge(id, minVal, maxVal, unit) {
  function polarToCartesian(centerX, centerY, radius, rad) {
    return {
      x: centerX + (radius * Math.cos(rad)),
      y: centerY + (radius * Math.sin(rad))
    };
  }
  
  function arc(x, y, radius, val, minVal, maxVal){
      var start = polarToCartesian(x, y, radius, -Math.PI);
      var end = polarToCartesian(x, y, radius, -Math.PI*(1 - 1/(maxVal-minVal) * (val-minVal)));
  
      var d = [
          "M", start.x, start.y, 
          "A", radius, radius, 0, 0, 1, end.x, end.y
      ].join(" ");
  
      return d;       
  }

  var tmpl = 
  '<svg class="rGauge" viewBox="0 0 200 145">'+ 
    '<path class="rGauge-base" id="'+id+'_base" stroke-width="30" />'+ 
    '<path class="rGauge-progress" id="'+id+'_progress" stroke-width="30" stroke="#1565c0" />'+ 
    '<text class="rGauge-val" id="'+id+'_val" x="100" y="105" text-anchor="middle"></text>'+  
    '<text class="rGauge-min-val" id="'+id+'_minVal" x="40" y="125" text-anchor="middle"></text>'+  
    '<text class="rGauge-max-val" id="'+id+'_maxVal" x="160" y="125" text-anchor="middle"></text>'+  
  '</svg>';

  document.getElementById(id).innerHTML = tmpl;
  document.getElementById(id+'_base').setAttribute("d", arc(100, 100, 60, 1, 0, 1));
  document.getElementById(id+'_progress').setAttribute("d", arc(100, 100, 60, minVal, minVal, maxVal));
  document.getElementById(id+'_minVal').textContent = minVal;
  document.getElementById(id+'_maxVal').textContent = maxVal;

  var gauge = {
    setVal: function(val) {
      val = Math.max(minVal, Math.min(val, maxVal));
      document.getElementById(id+'_progress').setAttribute("d", arc(100, 100, 60, val, minVal, maxVal));
      document.getElementById(id+'_val').textContent = val + (unit !== undefined ? unit: '');
      return gauge;
    },
    setColor: function(color) {
       document.getElementById(id+'_progress').setAttribute("stroke", color);
       return gauge;
    }
  }
  
  return gauge;
}

function createVerGauge(id, minVal, maxVal, unit) {
  var tmpl = 
  '<svg class="vGauge" viewBox="0 0 145 145">'+
    '<rect class="vGauge-base" id="'+id+'_base" x="30" y="25" width="30" height="100"></rect>'+
    '<rect class="vGauge-progress" id="'+id+'_progress" x="30" y="25" width="30" height="0" fill="#1565c0"></rect>'+
    '<text class="vGauge-val" id="'+id+'_val" x="70" y="80" text-anchor="start"></text>'+
    '<text class="vGauge-min-val" id="'+id+'_minVal" x="70" y="125"></text>'+
    '<text class="vGauge-max-val" id="'+id+'_maxVal" x="70" y="30" text-anchor="start"></text>'+
  '</svg>';
  
  document.getElementById(id).innerHTML = tmpl;
  document.getElementById(id+'_minVal').textContent = minVal;
  document.getElementById(id+'_maxVal').textContent = maxVal;
  
  var gauge = {
    setVal: function(val) {
      val = Math.max(minVal, Math.min(val, maxVal));
      var height = 100/(maxVal-minVal) * (val-minVal);
      
      document.getElementById(id+'_progress').setAttribute("height", height);
      document.getElementById(id+'_progress').setAttribute("y", 25+(100-height));
      document.getElementById(id+'_val').textContent = val + (unit !== undefined ? unit: '');
      return gauge;
    },
    setColor: function(color) {
       document.getElementById(id+'_progress').setAttribute("fill", color);
       return gauge;
    }
  }
  
  return gauge;
}
