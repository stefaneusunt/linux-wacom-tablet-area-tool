<template>
  <div>
    <div v-if="device_connected">
      <label>Device:</label>
      <select @change="update_dev_i" :value="cur_dev_i">
        <option v-for="(d, i) in devices" :value="i">{{d['DeviceName']}}</option>
      </select>
      <div style="display: block; height: 0.6em"></div>
    </div>
    <div style="width: 601px; position: relative">
      <img src="resources/images/Wacom%20Intuos%20no%20logo.png" class="tab-img" draggable="false" @dragstart="return_false()">
      <div class="img-cover"></div>
      <div v-if="device_connected">
        <div class="area-container" ref="pc">
          <movable-square :style="{left: px_ta_x+'px', top: px_ta_y+'px', width: px_ta_w+'px', height: px_ta_h+'px',
        transform: 'none', backgroundColor:'rgba(0,0,0,0)', cursor: 'move'}"
                          :coords.sync="area_drag"></movable-square>
          <movable-square :coords.sync="tl" style="cursor: nw-resize"></movable-square>
          <movable-square :coords.sync="tr" style="cursor: ne-resize"></movable-square>
          <movable-square :coords.sync="bl" style="cursor: sw-resize"></movable-square>
          <movable-square :coords.sync="br" style="cursor: se-resize"></movable-square>
          <movable-square :coords.sync="bm" style="cursor:  s-resize"></movable-square>
          <movable-square :coords.sync="rm" style="cursor:  e-resize"></movable-square>
          <movable-square :coords.sync="tm" style="cursor:  n-resize"></movable-square>
          <movable-square :coords.sync="lm" style="cursor:  w-resize"></movable-square>
        </div>
      </div>
      <p class="no-dev-p" v-if="!device_connected">No device detected!</p>
    </div>
    <div style="display: block; height: 5px"></div>
    <div style="display: flex; align-items: center" v-if="device_connected">
      <div class="inputs-container">
        <div class="space-between">
          <label>Top:</label>
          <input ref="i1" type="number" :value="ta_t" @keydown.enter="ta_t = $refs.i1.value"/>
        </div>
        <div class="space-between">
          <label>Left:</label>
          <input ref="i2" type="number" :value="ta_l" @keydown.enter="ta_l = $refs.i2.value"/>
        </div>
      </div>
      <div style="display: block; width: 1em"></div>
      <div class="inputs-container">
        <div class="space-between">
          <label>Bottom:</label>
          <input ref="i3" type="number" :value="ta_b" @keydown.enter="ta_b = $refs.i3.value"/>
        </div>
        <div class="space-between">
          <label>Right:</label>
          <input ref="i4" type="number" :value="ta_r" @keydown.enter="ta_r = $refs.i4.value"/>
        </div>
      </div>
      <div style="display: block; width: 0.6em"></div>
      <div>
        <label style="margin-right: 0.6em">Osu! sensitivity:</label>

        <input type="number" v-model="osu_sens" @wheel="1 + 1" step="0.01" max="20" min="1"/>
      </div>
      <div style="display: block; flex-grow: 1"></div>
      <button :disabled="applied" @click="apply_area">Apply</button>

    </div>
  </div>
</template>

<script>
  import MovableSquare from './movable-square.vue';
  //import {list_devices, rconsole} from '../lib/wacom_API'; RIP old Wacom API
  import {get_wacom_devices} from '../lib/wacom';

  export default {
    components: {MovableSquare},
    name: "tab-area-tool",
    data: function() {
      return {
        px_ta_x: 50,
        px_ta_y: 50,
        px_ta_w: 300,
        px_ta_h: 200,
        pc_w: 1,
        pc_h: 1,
        applied: false,
        devices: [],
        cur_dev_i: 0,
        osu_sens: 1
      }
    },
    computed: {
      tl: {
        get: function() {
          return {x: this.px_ta_x, y: this.px_ta_y};
        },
        set: function(new_coords) { // Origin +d, Size -d
          const [dx, dy] = [new_coords.x - this.tl.x, new_coords.y - this.tl.y];
          this.px_ta_w -= dx;
          this.px_ta_h -= dy;
          [this.px_ta_x, this.px_ta_y] = [new_coords.x, new_coords.y];
        }
      },
      tr: {
        get: function() {
          return {x: this.px_ta_x + this.px_ta_w, y: this.px_ta_y};
        },
        set: function(new_coords) {
          const [dx, dy] = [new_coords.x - this.tr.x, new_coords.y - this.tr.y];
          this.px_ta_w += dx;
          this.px_ta_h -= dy;
          this.px_ta_y += dy;
        }
      },
      bl: {
        get: function() {
          return {x: this.px_ta_x, y: this.px_ta_y + this.px_ta_h};
        },
        set: function(new_coords) {
          const [dx, dy] = [new_coords.x - this.bl.x, new_coords.y - this.bl.y];
          this.px_ta_h += dy;
          this.px_ta_w -= dx;
          this.px_ta_x += dx;
        }
      },
      br: {
        get: function() {
          return {x: this.px_ta_x + this.px_ta_w, y: this.px_ta_y + this.px_ta_h};
        },
        set: function(new_coords) {
          const [dx, dy] = [new_coords.x - this.br.x, new_coords.y - this.br.y];
          this.px_ta_w += dx;
          this.px_ta_h += dy;
        }
      },
      tm: {
        get: function() {
          return {x: this.px_ta_x + this.px_ta_w / 2, y: this.px_ta_y}
        },
        set: function(new_coords) {
          const dy = new_coords.y - this.tm.y;
          this.px_ta_h -= dy;
          this.px_ta_y += dy;
        }
      },
      lm: {
        get: function() {
          return {x: this.px_ta_x, y: this.px_ta_y + this.px_ta_h / 2}
        },
        set: function(new_coords) {
          const dx = new_coords.x - this.lm.x;
          this.px_ta_x += dx;
          this.px_ta_w -= dx;
        }
      },
      bm: {
        get: function() {
          return {x: this.px_ta_x + this.px_ta_w / 2, y: this.px_ta_y + this.px_ta_h}
        },
        set: function(new_coords) {
          const dy =  new_coords.y - this.bm.y;
          this.px_ta_h += dy;
        }
      },
      rm: {
        get: function() {
          return {x: this.px_ta_x + this.px_ta_w, y: this.px_ta_y + this.px_ta_h / 2}
        },
        set: function(new_coords) {
          this.px_ta_w += new_coords.x - this.rm.x;
        }
      },
      area_drag: {
        get: function() {
          return {x: this.px_ta_x, y: this.px_ta_y};
        },
        set: function(new_coords) {
          [this.px_ta_x, this.px_ta_y] = [new_coords.x, new_coords.y];
        }
      },
      ta_t: {
        get: function() {
          return Math.ceil(this.px_ta_y / this.pc_h * this.dev['AreaSize'].height);
        },
        set: function(val) {
          this.px_ta_y = val / this.dev['AreaSize'].height * this.pc_h;
        }
      },
      ta_l: {
        get: function() {
          return Math.ceil(this.px_ta_x / this.pc_w * this.dev['AreaSize'].width);
        },
        set: function(val) {
          this.px_ta_x = val / this.dev['AreaSize'].width * this.pc_w;
        }
      },
      ta_b: {
        get: function() {
          return Math.ceil((this.px_ta_y + this.px_ta_h) / this.pc_h * this.dev['AreaSize'].height);
        },
        set: function(val) {
          this.px_ta_h = val / this.dev['AreaSize'].height * this.pc_h - this.px_ta_y;
        }
      },
      ta_r: {
        get: function() {
          return Math.ceil((this.px_ta_x + this.px_ta_w) / this.pc_w * this.dev['AreaSize'].width);
        },
        set: function(val) {
          this.px_ta_w = val / this.dev['AreaSize'].width * this.pc_w - this.px_ta_x;
        }
      },
      device_connected: function() {
        return this.devices.length !== 0;
      },
      dev: function() {
        return this.devices[this.cur_dev_i];
      }
    },
    watch: {
      px_ta_x: function() {
        this.sanitize_area();
      },
      px_ta_y: function() {
        this.sanitize_area();
      },
      px_ta_h: function() {
        this.sanitize_area();
      },
      px_ta_w: function() {
        this.sanitize_area();
      },
      device_connected: function(dev_con) {
        if (dev_con) {
          this.$nextTick(function() {
            this.update_area_container_sizes();
            this.device_area2gui();
          });
        }
      },
      osu_sens: function(new_val) {
        //console.log('reee', new_val);
        const [new_w, new_h] = [this.dev['AreaSize'].width / new_val, this.dev['AreaSize'].height / new_val];
        //console.log([new_w, new_h]);
        [this.ta_t, this.ta_l, this.ta_b, this.ta_r] = [0, 0, new_h, new_w];
      }
    },
    methods: {
      sanitize_area: function() {
        // If sanitization is necessary, then the area changed, so unlock the apply button
        this.applied = false;
        const pc = this.$refs.pc;
        if (this.px_ta_x < 0) {this.px_ta_x = 0;}
        if (this.px_ta_x + this.px_ta_w > pc.offsetWidth) {this.px_ta_x = pc.offsetWidth - this.px_ta_w;}
        if (this.px_ta_y < 0) {this.px_ta_y = 0;}
        if (this.px_ta_y + this.px_ta_h > pc.offsetHeight) {this.px_ta_y = pc.offsetHeight - this.px_ta_h;}
        if (this.px_ta_w < 0) {this.px_ta_w = 0;}
        if (this.px_ta_h < 0) {this.px_ta_h = 0;}
      },
      apply_area: function() {
        //this.dev['Area'] = `${this.ta_l} ${this.ta_t} ${this.ta_r} ${this.ta_b}`;
        this.dev.set_param('Area', `${this.ta_l} ${this.ta_t} ${this.ta_r} ${this.ta_b}`).then(() => {
          this.applied = true;
        });
      },
      update_area_container_sizes: function() {
        if (this.device_connected) {
          this.pc_h = this.$refs.pc.offsetHeight;
          this.pc_w = this.$refs.pc.offsetWidth;
        }
      },
      update_devices_status: function() {
        // Updates all the vars relating to devices to match the real world status
        get_wacom_devices().then((devs) => {
          this.devices = [];
          for (let d of devs) {
            if (d.AreaSize.width !== 0) {
              this.devices.push(d);
            }
          }
        });
      },
      device_area2gui: function() {
        // Update the px* vars to match the actual device area
        this.dev.get_param('Area').then((area) => {
          [this.ta_l, this.ta_t, this.ta_r, this.ta_b] = area.split(' ').map(x => {return parseInt(x)});
        })
      },
      update_dev_i: function(ev) {
        // console.log(ev.target.value);
        this.cur_dev_i = ev.target.value;
        localStorage['cur_dev_i'] = ev.target.value;
        this.device_area2gui();
      }
    },
    created: function() {
      this.update_devices_status();
      setInterval(() => {
        this.update_devices_status();
      }, 2000);
      // Restore the selected dev index from local storage
      if (localStorage['cur_dev_i']) {
        this.cur_dev_i = parseInt(localStorage['cur_dev_i']);
      }
    }
  }
</script>

<style scoped>
  img {
    width: 100%;
    height: auto;
    user-focus: none;
    user-select: none;
    user-modify: none;
  }
  .area-container {
    position: absolute;
    border: 1px solid blue;
    top: 31.8%;
    left: 13.5%;
    width: 72.5%;
    height: 56%;
  }
  .tab-img {
    pointer-events: none;
  }
  .area-visualizer {
    display: block;
    position: absolute;
    border: 1px solid red;
  }

  .img-cover {
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    user-focus: none;
    user-select: none;
    user-modify: none;
  }
  .inputs-container {
    display: flex;
    flex-direction: column;
    width: 18%;
  }
  .space-between {
    display: flex;
    width: 100%;
    justify-content: space-between;
  }
  input {
    width: 3.5em;
  }
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  .no-dev-p {
    color: #f7f6f6;
    font-family: inherit;
    font-size: 30pt;
    font-weight: bold;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    white-space: nowrap;
    cursor: default;
    user-select: none;
  }
</style>