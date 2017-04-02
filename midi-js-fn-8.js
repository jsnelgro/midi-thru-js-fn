inlets = 2
outlets = 9


// utils (b/c max is dumb and the include fn doesn't work for frozen devices)
// utils

var console = { log: function (val) { outlet(1, Number(val)) } }
var log = console.log
var out = outlet

var int = function (value) {
  return Math.floor(Number(value))
}

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

var scaletoval = function (value, s1, s2) {
  return scale(value, s1, s2, 0.0, 1.0)
}

var valtosteps = function (value, steps) {
  return scaletoval(int(valscale(value, 0, steps)), 0, steps)
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




var self = this
var val1 = 0
var val2 = 0
var val3 = 0
var val4 = 0
var val5 = 0
var val6 = 0
var val7 = 0
var val8 = 0
var state = {}
var usrfn = 'if (isNote) {} else { outlet(1, val1); }'

var tempo = 120
var timesig = [4, 4]
var songtime = 0.0
/**
song time in seconds, represented as double:
time = beats * 60 / tempo (in bpm)
*/

var grid = {
  bar: 0,
  beat: 0,
  sxtn: 0,
  tick: 0
}

function set_tempo (t) {
  tempo = t
}

function set_timesig (n, d) {
  timesig = [n, d]
}

function set_songtime (st) {
  songtime = st
}

function set_grid (gs) {
  gs = gs.split('.')
  grid.bar = Number(gs[0])
  grid.beat = Number(gs[1])
  grid.sxtn = Number(gs[2])
  grid.tick= Number(gs[3])
}

function text (txt) {
  if (txt[0] === '"' && txt[txt.length-1] === '"') {txt = txt.substr(1, txt.length-2)}
  usrfn = txt
}

function auxvals () {
  for (var i in arguments) {
    var key = 'val' + ~~(Number(i) + 1)
    this[key] = arguments[i]
  }
  var isNote = false
  eval(usrfn)
}
auxvals.immediate = 1

function midiinput (pitch, velocity, pitchbend) {
  var isNote = true
  eval(usrfn)
}
midiinput.immediate = 1
