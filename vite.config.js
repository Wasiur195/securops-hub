import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      usePolling: true, // এটি উইন্ডোজের ফাইল ওয়াচিং এরর সমাধান করে
    },
  },
})