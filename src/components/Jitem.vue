<template>
  <table>
    <thead><tr>
      <td class="selector">
        <button v-if="!isSimple && deletable" :class="expandCss" type="button" @click="toggleExpand()"></button>
      </td>
      <td class="selector"><jselector :type="valueType" :deletable="deletable" @add="addSub" @del="delSelf" @change="changeType" @copy="copySelf"/></td>
      <td class="fix50" @click="val => nameOnEdit = true">
        <input class="fix50" v-if="deletable && nameType === TYPE_STRING && nameOnEdit" v-focus v-model.lazy="innerName" @blur="val => nameOnEdit = false"/>
        <span v-else>{{ nameString }}</span>
      </td>
      <td @click="val => {valueOnEdit = true;toggleExpand()}">
        <input v-if="valueOnEdit && isBoolean" v-focus type="checkbox" v-model.lazy="innerValue" @blur="val => valueOnEdit = false"/>
        <input v-else-if="valueOnEdit && isNumber" v-focus type="number" v-model.number.lazy="innerValue" @blur="val => valueOnEdit = false"/>
        <input v-else-if="valueOnEdit && isString" v-focus v-model.trim.lazy="innerValue" @blur="val => valueOnEdit = false"/>
        <span v-else-if="!isSimple && expand && deletable">{{ size(innerValue) }} items</span>
        <span v-else>{{ valueString }}</span>
      </td>
      </tr></thead>
    <tbody v-if="expand && !isSimple">
      <tr v-for="(item, key) in innerValue" :key="path + ':' + key">
        <td colspan="4"><jitem class="intent" :value="item" :name="key" :level="level + 1" :path="path + ':' + key" :showLength="showLength" :key="path + ':' + key" @update="changeValue" @update:name="changeName" @del="delItem" @error="error" @copy="copyItem"></jitem></td>
      </tr>
    </tbody>
  </table>
</template>
<script>
'use strict'

import { TYPES, dataType, toString, nullValue, size } from '../utils/utils'
import jselector from './Jselector'

export default {
  name: 'jitem',
  props: {
    name: { required: true },
    value: { required: true },
    path: { default: '' },
    level: { default: 1 },
    showLength: { default: 50 }
  },
  data: function () {
    return Object.assign({
      innerValue: this.value,
      innerName: this.name,
      expand: this.level === 1,
      nameOnEdit: false,
      valueOnEdit: false
    }, TYPES)
  },
  computed: {
    deletable () { return !(this.level === 1) },
    nameType () { return this.dataType(this.name) },
    nameString () {
      if (this.nameType === this.TYPE_NUMBER) {
        return '[' + this.toString(this.name) + ']'
      } else {
        return this.name
      }
    },
    valueType () { return this.dataType(this.value) },
    expandCss () { return {bg: true, expand: this.expand, fold: !this.expand} },
    isMap () { return this.valueType === this.TYPE_MAP },
    isArray () { return this.valueType === this.TYPE_ARRAY },
    isString () { return this.valueType === this.TYPE_STRING },
    isNumber () { return this.valueType === this.TYPE_NUMBER },
    isBoolean () { return this.valueType === this.TYPE_BOOLEAN },
    isSimple () { return this.isBoolean || this.isString || this.isNumber || this.value === null },
    valueString () {
      let value = this.toString(this.value)
      if (value.length > this.showLength) {
        return value.substring(0, this.showLength - 3) + '...'
      } else {
        return this.toString(this.value)
      }
    }
  },
  components: { jselector },
  methods: {
    dataType,
    toString,
    size,
    // Change inside.
    toggleExpand () {
      if (this.level !== 1) {
        this.expand = !this.expand
      }
    },
    addSub () {
      if (this.valueType === this.TYPE_ARRAY) {
        this.innerValue.splice(this.innerValue.length, 0, '')
      } else if (this.valueType === this.TYPE_MAP) {
        this.innerValue = Object.assign({'name': ''}, this.innerValue)
      }
      this.expand = true
    },
    changeType (newType) {
      if (newType === this.TYPE_STRING) {
        this.innerValue = this.toString(this.innerValue)
      } else if (newType === this.TYPE_NUMBER) {
        let value = parseFloat(this.innerValue)
        if (Number.isNaN(value)) {
          this.innerValue = nullValue(newType)
        } else {
          this.innerValue = value
        }
      } else if (newType === this.TYPE_BOOLEAN) {
        this.innerValue = true
      } else if (newType === this.TYPE_NULL) {
        this.innerValue = null
      } else {
        try {
          let value = JSON.parse(this.innerValue)
          if (this.dataType(value) === newType) {
            this.innerValue = value
          } else {
            if (newType === this.TYPE_ARRAY) {
              this.innerValue = [this.innerValue]
            } else {
              this.innerValue = nullValue(newType)
            }
          }
        } catch (error) {
          if (newType === this.TYPE_ARRAY) {
            this.innerValue = [this.innerValue]
          } else {
            this.innerValue = nullValue(newType)
          }
        }
      }
    },
    rerender () {
      this.expand = !this.expand
      this.expand = !this.expand
    },
    error (msg) {
      this.$emit('error', msg)
      this.rerender()
    },
    copySelf (valueString) { this.$emit('copy', this.valueString) },
    delSelf () { this.$emit('del', this.name) },
    // Change upside
    changeValue (key, newVal) {
      this.$set(this.innerValue, key, newVal)
      this.innerValue = this.innerValue
    },
    changeName (newKey, oldKey) {
      // Only map can change key.
      if (this.valueType === this.TYPE_MAP) {
        if (this.innerValue[oldKey] === undefined) {
          this.$emit('error', oldKey + ' not found!')
        } else if (this.innerValue[newKey] !== undefined) {
          this.$emit('error', 'Key exists!')
        } else {
          this.$set(this.innerValue, newKey, this.innerValue[oldKey])
          this.$delete(this.innerValue, oldKey)
          this.innerValue = this.innerValue
        }
      } else {
        this.$emit('error', 'Type error!')
      }
    },
    delItem (key) {
      this.$delete(this.innerValue, key)
      this.innerValue = this.innerValue
    },
    copyItem (valueString) { this.$emit('copy', valueString) }
  },
  watch: {
    // Value model change.
    innerValue (newVal, oldVal) {
      console.log(newVal)
      console.log(oldVal)
      if (this.deletable) {
        this.$emit('update', this.name, newVal)
      } else {
        this.$emit('update', newVal)
      }
    },
    innerName (newName, oldName) { this.$emit('update:name', newName, oldName) }
  },
  directives: {
    focus: {
      inserted (el) { el.focus() }
    }
  }
}
</script>
<style scoped>
@import '../assets/jsoneditor.css';
</style>
