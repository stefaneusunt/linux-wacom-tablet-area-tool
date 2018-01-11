////////////////////////////////
//       OBSOLETE CODE        //
// Am rescris libraria sa fie //
//   asincrona in wacom.js    //
////////////////////////////////

// A small lib that will interact with the Wacom devices using the xsetwacom cli tool
const cp = window.require('child_process');
const NodeConsole = window.require('console');

// Prepare an actual console
const console = new NodeConsole.Console(window.process.stdout, window.process.stderr);

export const rconsole = console;

export function cmd_out (cmd) {
  // Executes cmd, logs the call and returns the output as a string
  console.log('[cmd log] ' + cmd);
  return cp.execSync(cmd).toString();
}

export function list_devices_names() {
  // Return a list of Wacom devices
  const out = cmd_out('xsetwacom --list devices');
  const re = /(.*?) *?\t/;
  const devs = [];
  for (let l of out.split('\n')) {
    const m = re.exec(l);
    // console.log(m);
    if (m) {
      devs.push(m[1].trim());
    }
  }
  return devs;
}

export function list_device_params (devname) {
  // Return a object with parameters and their current value for the give device
  const re = /Option *?"(.*?)" *?"(.*?)"/;
  const out = cmd_out(`xsetwacom --get "${devname}" all`);
  let opts = {};
  for (let l of out.split('\n')) {
    const m = re.exec(l); // math re against l and return a match list
    // console.log(m);
    if (m) {
      opts[m[1]] = m[2];
    }
  }
  return opts;
}

export function set_device_param(devname, prop, val) {
  // Set a parameter for a device, returning true if succeds, false otherwise
  const out = cmd_out(`xsetwacom --set "${devname}" "${prop}" "${val}"`)

}

const MaxAreas = {
  'Wacom Intuos PT S 2 Pen stylus': {width: 15200, height: 9500}
};

export class WacomDevice {
  constructor(devname) {
    this.DeviceName = devname;
    const params = list_device_params(devname);
    this._params_cache = params;
    if (MaxAreas[devname]) {
      // This device has a known area size, expose it
      this.AreaSize = MaxAreas[devname];
    }
    for (let p in params) {
      Object.defineProperty(this, p, {
        get: () => {
          return this._params_cache[p];
        },
        set: (val) => {
          set_device_param(this.DeviceName, p, val);
          this._params_cache[p] = val;
        },
        enumerable: true
      });
    }
  }
}

export function list_devices() {
  let devs = [];
  for (let d of list_devices_names()) {
    devs.push(new WacomDevice(d));
  }
  return devs;
}

