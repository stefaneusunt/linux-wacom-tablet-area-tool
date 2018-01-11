<template>
  <div>
    <h2>Wacom API Test</h2>
    <hr>
    <p>Testing cmd_out to list files from my home dir:</p>
    <pre style="overflow: scroll; height: 10vh">{{cmd_out_test}}</pre>
    <hr>
    <p>List available Wacom devices:</p>
    <ul>
      <li v-for="d in devices">{{d}}</li>
    </ul>
  </div>
</template>

<script>
  import * as wacom_api from '../lib/wacom_API'
  export default {
    name: "wacom-test",
    computed: {
      cmd_out_test: function () {
        return wacom_api.cmd_out('ls ~/');
      },
      devices: function () {
        return wacom_api.list_devices_names();
      }
    },
    mounted: function () {
      const d = wacom_api.list_devices_names();
      wacom_api.list_device_params(d[0]);
      // wacom_api.set_device_param('Wacom Intuos PT S 2 Pen stylus', 'Area', '0 0 3000 3000');
      let devs = wacom_api.list_devices();
      devs = devs.filter(x => {return x['DeviceName'].endsWith('stylus')});
      console.log(devs[0]['Area']);
      devs[0]['Area'] = '0 0 3000 3000';
    }
  }
</script>

<style scoped>

</style>