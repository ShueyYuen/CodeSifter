<template>
  <div id="app">
    <header>
      <h1>Conditional Loader - Vue Example</h1>
      <!-- #if IS_LINUX -->
      <div class="linux-badge">Linux Mode</div>
      <!-- #endif -->
    </header>
    <main>
      <ServerInfo />
    </main>
  </div>
</template>

<script>
import ServerInfo from './components/ServerInfo.vue'

export default {
  name: 'App',
  components: {
    ServerInfo
  },
  data() {
    return {
      serverInfo: /* #if IS_LINUX */ 'Linux Server' /* #else */ 'Windows Server' /* #endif */,
    }
  },
  mounted() {
    /* #if IS_LINUX */
    console.error('Linux mode')
    /* #endif */
    console.log('App mounted')
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 60px auto;
  max-width: 800px;
}

header {
  margin-bottom: 30px;
  position: relative;
}

/* #if IS_LINUX */
.linux-badge {
  position: absolute;
  top: 0;
  right: 0;
  background-color: #42b983;
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  font-weight: bold;
}
/* #endif */

h1 {
  color: #42b983;
}
</style>
