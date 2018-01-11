<template>
  <div class="movable-square" :style="{top: coords.y+'px', left: coords.x+'px'}" @mousedown="start_moving" ref="el"></div>
</template>

<script>
  // The component will not actually move itself, it will just emit events and the parent will update its coords

  export default {
    name: 'movable-square',
    props: ['coords'],
    data: function() {
      return {
        old_pos: undefined,
        old_mouse: undefined
      }
    },
    methods: {
      start_moving: function (ev) {
        this.old_pos = [this.coords.x, this.coords.y];
        this.old_mouse = ev;
        document.addEventListener('mousemove', this.emit_updates);
        document.addEventListener('mouseup', this.stop_moving);
      },
      emit_updates: function(ev) {
        let new_coords = {
          x: this.old_pos[0] + (ev.screenX - this.old_mouse.screenX),
          y: this.old_pos[1] + (ev.screenY - this.old_mouse.screenY)
        };
        // Bound checks
        const pc = this.$refs.el.parentElement;
        if (new_coords.x < 0) {new_coords.x = 0}
        if (new_coords.y < 0) {new_coords.y = 0}
        if (new_coords.x > pc.offsetWidth) {new_coords.x = pc.offsetWidth}
        if (new_coords.y > pc.offsetHeight) {new_coords.y = pc.offsetHeight}

        this.$emit('update:coords', new_coords);
      },
      stop_moving: function() {
        document.removeEventListener('mousemove', this.emit_updates);
        document.removeEventListener('mouseup', this.stop_moving);
      }
    }
  };
</script>

<style lang="scss" scoped>
  $size: 15px;
  .movable-square {
    display: block;
    position: absolute;
    width: $size;
    height: $size;
    border: 1.4px solid red;
    background-color: #2f2f2f;
    transform: translate(-50%, -50%);
  }
</style>