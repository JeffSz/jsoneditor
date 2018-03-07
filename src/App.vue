<template>
  <div id="app" class="container">
    <div class="panel panel-default">
      <div class="panel-heading">
        <h3 class="panel-title">JsonEditor使用实例</h3>
      </div>
      <div class="panel-body">
        <jitem class="table" :value="value" :name="name" :showLength="100" @update="change" @error="error" @copy="copy"/>
      </div>
    </div>
  </div>
</template>

<script>
import Jitem from './components/Jitem'

export default {
  name: 'App',
  components: { Jitem },
  data () {
    return {
      name: 'test',
      value: {'a': 1, 'b': 3, 'c': null, 'd': {'1': 'a', '2': 'b'}, 'e': {'a': 'c', '2': 'b'}, 'f': true}
    }
  },
  methods: {
    change: function (newVal) {
      console.log(newVal)
      this.value = newVal
    },
    error: function (msg) {
      alert(msg)
    },
    copy: function (value) {
      alert(value)
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
