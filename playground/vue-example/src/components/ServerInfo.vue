<template>
  <div class="server-info">
    <h2>Server Configuration</h2>
    <div class="info-card">
      <div class="info-row">
        <span class="label">Server Type:</span>
        <span class="value">{{ serverInfo.type }}</span>
      </div>
      <div class="info-row">
        <span class="label">Response Delay:</span>
        <span class="value">{{ serverInfo.options.delay }}ms</span>
      </div>
      <!-- #if IS_LINUX -->
      <div class="info-row linux-feature">
        <span class="label">Linux Specific:</span>
        <span class="value">{{ serverInfo.linuxSpecific ? 'Enabled' : 'Disabled' }}</span>
      </div>
      <!-- #endif -->
    </div>
  </div>
</template>

<script>
/* #if IS_LINUX */
import { createServer } from '../services/create-linux-server';
/* #else */
import { createServer } from '../services/create-server';
/* #endif */

export default {
  name: 'ServerInfo',
  data() {
    return {
      serverInfo: createServer({
        delay: __IS_LINUX__ ? 600 : 100,
        /* #if IS_PRODUCTION */
        caching: true,
        compression: 'gzip',
        /* #endif */
        bunlder: __WEBPACK__,
      })
    }
  },
  mounted() {
    /* #if IS_LINUX */
    console.log('Server optimized for Linux environment');
    /* #endif */
  }
}
</script>

<style scoped>
.server-info {
  background-color: #f5f5f5;
  border-radius: 8px;
  padding: 20px;
  margin: 20px 0;
}

.info-card {
  background-color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  padding: 15px;
  margin-top: 15px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

.info-row:last-child {
  border-bottom: none;
}

.label {
  font-weight: bold;
  color: #666;
}

.value {
  color: #42b983;
}

/* #if IS_LINUX */
.linux-feature {
  background-color: #f0f7f1;
}
/* #endif */
</style>
