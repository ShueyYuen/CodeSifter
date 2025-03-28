import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import ConditionalCode from 'code-sifter/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), ConditionalCode({
    conditions: {
      'IS_SHOW_ICON': false,
      'IS_SHOW_TEXT': true,
    }
  })],
})
