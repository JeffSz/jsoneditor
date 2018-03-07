<template>
  <div class="dropdown selector">
    <button :class="[basic, cssType]" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" @click="val => this.display=!this.display">
    </button>
    <ul ref="menu" v-bind:class="{ 'dropdown-menu':true, show: display }" aria-labelledby="dLabel">
      <li role="separator" class="divider"></li>
      <li v-for="tp in types" :key="tp" v-bind:class="{ active: type===tp }"><a href="#" :data-type="tp" @click="change">{{ tp }}</a></li>
      <li v-if="deletable" role="separator" class="divider"></li>
      <li v-if="deletable"><a href="#" @click="del">{{ ACTION_DEL }}</a></li>
      <li v-if="type === TYPE_ARRAY || type === TYPE_MAP" role="separator" class="divider"></li>
      <li v-if="type === TYPE_ARRAY || type === TYPE_MAP"><a href="#" @click="add">{{ ACTION_ADD }}</a></li>
      <li role="separator" class="divider"></li>
      <li><a href="#" @click="copy">{{ ACTION_COPY }}</a></li>
      <li role="separator" class="divider"></li>
    </ul>
  </div>
</template>
<script>
import { TYPES, ACTIONS } from '../utils/utils'

export default {
  name: 'jselector',
  props: {type: { required: true }, deletable: { default: true }},
  data () {
    return Object.assign({
      types: TYPES,
      display: false,
      basic: 'bg'
    }, TYPES, ACTIONS)
  },
  computed: {
    cssType () {
      if (this.type === this.TYPE_ARRAY) {
        return 'array'
      } else if (this.type === this.TYPE_MAP) {
        return 'map'
      } else {
        return 'simple'
      }
    }
  },
  watch: {
    // Make the menu that is showing closed when click event occors outside the menu area.
    display (newVal, oldVal) {
      if (newVal) {
        document.addEventListener('click', this.clickOutSide)
      } else {
        document.removeEventListener('click', this.clickOutSide)
      }
    }
  },
  methods: {
    clickOutSide (e) {
      // Should be outsize the menu.
      if (this.display && !this.$refs.menu.contains(e.target)) {
        this.display = false
      }
    },
    change () {
      // Means a valid change action.
      this.display = false
      if (this.type !== event.target.dataset.type) {
        this.$emit('change', event.target.dataset.type)
      }
    },
    add () {
      this.display = false
      this.$emit('add')
    },
    del () {
      this.display = false
      this.$emit('del')
    },
    copy () {
      this.display = false
      this.$emit('copy')
    }
  }
}
</script>
<style scoped>
@import '../assets/jsoneditor.css';
</style>
