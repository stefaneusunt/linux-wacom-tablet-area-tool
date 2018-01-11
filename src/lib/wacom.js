// Like the old Wacom API, but implemented properly and async

const {execFile} = window.require('child_process');
const NodeConsole = window.require('console');

// Prepare an actual console
const console = new NodeConsole.Console(window.process.stdout, window.process.stderr);

function cmd_out(args) {
  return new Promise((resolve, reject) => {
    // Stringify everything
    args = args.map(x => {return x.toString()});
    execFile(args[0], args.slice(1), (err, stdout, stderr) => {
      console.log(`[cmd] ${args.join(' ')}`);
      if (err) {
        console.log(`Error: ${err.toString()}`);
        reject(err);
      } else {
        resolve(stdout + stderr);
      }
    });
  });
}
/*
cmd_out(['ls', '-lh']).then((out) => {
  console.log(out.toUpperCase());
});*/
function list_devs() {
  return new Promise((resolve, reject) => {
    cmd_out(['xsetwacom', '--list']).then((out) => {
      const re = /(.*?) *?id: *?(\d+)/;
      let devs = [];
      for (let l of out.split('\n')) {
        const m = re.exec(l);
        if (m) {
          devs.push({name: m[1].trim(), id: m[2]});
        }
      }
      resolve(devs);
    });
  });
}


list_devs().then((devs) => {
  console.log('Found the following devices:\n', devs);
});

class WacomDevice {
  constructor(devname, id) {
    this.DeviceName = devname;
    this.id = id;
  }
  get_param(param_name) {
    return new Promise((resolve, reject) => {
      cmd_out(['xsetwacom', '--get', this.id, param_name]).then((val) => {
        resolve(val);
      });
    });
  }
  set_param(param_name, val) {
    return new Promise((resolve, reject) => {
      cmd_out(['xsetwacom', '--set', this.id, param_name, val]).then((out) => {
        console.log(`[WacomDevice: ${this.DeviceName}] set '${param_name}' to '${val}'.`);
        resolve('ok');
      });
    });
  }
}

export function get_wacom_devices() {
  return new Promise((resolve, reject) => {
    list_devs().then((devs) => {
      Promise.all(devs.map(d => {
        return new Promise((resolve, reject) => {
          let wd = new WacomDevice(d.name, d.id);
          // Now get the maximum area if possible
          cmd_out(['xinput', '--list', d.id]).then((xinput_out) => {
            const re = /Label: (.+?)\n\s*?Range: (.+)\n/g;
            let opts = {};
            let m;
            do {
              m = re.exec(xinput_out);
              if (m) {
                opts[m[1]] = m[2];
              }
            } while (m);
            // all xinput parameters have been parsed
            // compute the max area size and add it to the wacom device obj
            // console.log(`${d.name}: ${JSON.stringify(opts)}`);
            if (opts['Abs X'] && opts['Abs Y']) {
              // gott'em
              const [w, h] = [opts['Abs X'], opts['Abs Y']].map(x => {
                return parseInt(x.split('-')[1].trim().split('.')[0]);
              });
              wd.AreaSize = {width: w, height: h}
            }
            resolve(wd);
          });
        });
      })).then((devs) => {
        devs.sort();
        resolve(devs)});
    });
  });
}


get_wacom_devices().then(devs => {console.log(devs)});
/*
get_wacom_devices.then((devs) => {
  for (d of devs) {
    if (d.DeviceName.endsWith('stylus')) {
      d.get_param('Area').then((area) => {
        console.log(`Tablet area: ${area}`);
        return d.set_param('Area', '3000 3000 15200 9500');
      }).then(() => {
        console.log('set');
      })
    }
  }
});*/