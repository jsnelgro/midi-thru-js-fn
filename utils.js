// utils

var console = { log: function (val) { outlet(1, Number(val)) } }
var log = console.log
var out = outlet

var setTimeout = function (fn, ms) {
  var tsk = new Task(fn)
  tsk.schedule(ms)
}

var wait = function (ms, fn) {
  setTimeout(fn, ms)
}

Array.prototype.foreach = function (fn) {
  for (var i in this) {
	if (this.hasOwnProperty(i)) {
      fn(this[i], Number(i), this)
	}
  }
  return this
}

Array.prototype.map = function (fn) {
  var toRet = []
  for (var i in this) {
	if (this.hasOwnProperty(i)) {
    	toRet.push(fn(this[i], Number(i), this))
	}
  }
  return toRet
}

Array.prototype.range = function (len) {
  len = len || 0
  var toRet = []
  for (var i = 0; i < len; i++) {
    toRet.push(i)
  }
  return toRet
}

Array.prototype.zeros = function (len) {
  len = len || 0
  var toRet = []
  for (var i = 0; i < len; i++) {
    toRet.push(0)
  }
  return toRet
}

var rand = function (low, hi, asInt) {
  low = low || 0
  hi = hi || 1
  var min = !!asInt ? (hi - low) + 1 : (hi - low)
  var val = low + (Math.random() * min)
  return (asInt ? Math.floor(val) : val)
}

var scale = function (value, s1, s2, e1, e2) {
  return (value - s1) * (e2 - e1) / (s2 - s1) + e1
}

var valscale = function (value, e1, e2) {
  return scale(value, 0.0, 1.0, e1, e2)
}

var valtomidi = function (value) {
  return Math.floor(valscale(value, 0, 127))
}

var miditoval = function (value) {
  return scale(value, 0, 127, 0, 1)
}

var ftom = function (freq) {
  // m  =  12*log2(fm/440 Hz) + 69
  return Math.round((12 * Math.log2(freq/440)) + 69)
}

var mtof = function (m) {
  // fm  =  2(m−69)/12(440 Hz).
  return Math.pow(2, (m - 69)/12) * 440
}

var clamp = function (val, min, maxi) {
  if (val > maxi) {
    return maxi
  }
  if (val < min) {
    return min
  }
  return val
}

var snap = function (note, scale) {
  var value = note % 12
  var octave = Math.floor(note / 12)
  var curr = scale[0]
  for (var i in scale) {
    var val = scale[i]
    if (Math.abs(value - val) < Math.abs(value - curr)) {
      curr = val
    }
  }
  return curr + (12 * (octave + 1))
}

// end utils
