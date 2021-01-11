# eventbus

## 使用
1. 安装
```shell
# use npm 
npm install @lifuzhao100/eventbus

# use yarn 
yarn add @lifuzhao100/eventbus
```
2. 使用
```javascript
import EventBus from '@lifuzhao100/eventbus'

function getErrorHandler(){
  // 返回自定义errorHandler
  return e => console.error(e)
}

const eventBus = new EventBus(getErrorHandler)

// 监听事件
eventBus.$on('event-name', message => {
  console.log(`got message:`, message)
})
// 监听一次事件
eventBus.$once('event-name2', message => {
  console.log(`listen once:`, message)
})

// 触发事件
eventBus.$emit('event-name', 'are u ok?')
eventBus.$emit('event-name2', 'are u ok?')

eventBus.$off('event-name')
```
## api
- $on   别名on
```typescript
function $on(event: string | Array<string>, fn: Function) : EventBus;
```
注册事件监听，event为Array时注册多个相同回调的事件监听
- $off  别名off
```typescript
function $off(event: string | Array<string>, fn: Function | undefined) : EventBus;
```
为 !fn === true时清空当前事件监听

- $once 别名once
```typescript
function $once(event: string | Array<string>, fn: Function | undefined) : EventBus;
```
执行第一次事件回调前会将当前回调移除(fn为Function时)或者清空(!fn === false时)

- $emit 别名emit
```typescript
function $emit(event: string, ...rest) : EventBus;
```
触发事件监听，将注册的同名事件的所有回调执行，参数为rest。(背后执行的是fn.apply(eventBus, rest))