<template>
  <div>
    <tab-area-tool></tab-area-tool>
  </div>
</template>

<script>


import TabAreaTool from "./components/tab-area-tool.vue";

export default {
  components: {
    TabAreaTool
  },
  name: 'app',

}
</script>
<style>
  body {
    background-color: #f7f6f6;
    font-family: Ubuntu;
    font-size: 11pt;
    color: #4c4c4c;
  }
  input {
    font-family: Ubuntu;
    font-size: 11pt;
    color: #4c4c4c;
  }
  button {
    font-family: Ubuntu;
    font-size: 11pt;
    color: #4c4c4c;
  }
  button:disabled {
    font-family: Ubuntu;
    font-size: 11pt;
    color: #4c4c4c;
    opacity: 0.65;
  }
  select {
    font-family: Ubuntu;
    font-size: 11pt;
    color: #4c4c4c;
  }
  option {
    font-family: Ubuntu;
    font-size: 11pt;
    color: #4c4c4c;
  }
  body > * {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
</style>