
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import fs from 'fs';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Read the current build number from a file, or create it if it doesn't exist
  let currentBuildNumber = '0';
  const buildNumberFile = '.build-number';
  
  try {
    if (fs.existsSync(buildNumberFile)) {
      currentBuildNumber = fs.readFileSync(buildNumberFile, 'utf8');
    }
  } catch (error) {
    console.error('Error reading build number:', error);
  }

  // Increment the build number
  const nextBuildNumber = (parseInt(currentBuildNumber) + 1).toString();

  // Save the new build number
  try {
    fs.writeFileSync(buildNumberFile, nextBuildNumber);
  } catch (error) {
    console.error('Error writing build number:', error);
  }

  return {
    server: {
      host: "0.0.0.0",
      port: 8080,
      strictPort: true,
    },
    plugins: [
      react(),
      mode === 'development' &&
      componentTagger(),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    define: {
      'import.meta.env.VITE_BUILD_NUMBER': JSON.stringify(nextBuildNumber)
    }
  };
});
