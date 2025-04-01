import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import CodeSifter from 'code-sifter/vite';

export default defineConfig({
  plugins: [
    react(),
    CodeSifter({
      conditions: {
        'IS_SHOW_ICON': false,
        'IS_SHOW_TEXT': true,
      }
    })
  ],
});
