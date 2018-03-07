# json-editor

> Json editor

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run e2e tests
npm run e2e

# run all tests
npm test
```

## Demo:
```
<script>
import Jitem from './components/Jitem'

export default {
  name: 'App',
  components: { Jitem },
  template: '<jitem id="app" :value="value" :name="name" :showLength="100" @update="change" @error="error" @copy="copy"/>'
  data () {
    return {
      name: 'test',
      value: {'a': 1, 'b': 3, 'c': null, 'd': {'1': 'a', '2': 'b'}, 'e': {'a': 'c', '2': 'b'}, 'f': true}
    }
  },
  methods: {
    change: function (newVal) {
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
```

## Param:
* value: value be edited.
* name: value name.
* showLength: max length showed in the editor of the value string.

## Message:
* change(newVal): triggered by the change event of the editor.
* error(msg): triggered by error event in the editor.
* copy(valueString): triggered by copy action on item
