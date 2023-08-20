import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

interface EnvConfig {
  host?: string;
  port?: number;
}

function parseEnvHost(host?: string): string | undefined {
  if (host === undefined) {
    console.info(`No environment variable 'HOST' defined. Using Vite's default host.`);
  }
  else {
    console.info(`Environment variable 'HOST' set to '${host}'.`);
  }

  return host;
}

function parseEnvPort(port?: string): number | undefined {
  if (port === undefined) {
    console.info(`No environment variable 'PORT' defined. Using Vite's default port.`);
    
    return undefined;
  }
  
  const portNumber = parseInt(port);

  if (isNaN(portNumber)) {
    console.info(
      `Invalid value '${port}' for environment variable 'PORT'. ` + 
      `Falling back to Vite's default port.`
    );

    return undefined;
  }
    
  console.info(`Environment variable 'PORT' set to ${portNumber}.`);

  return portNumber;
}

function parseEnvConfig(env: Record<string, string>): EnvConfig {
  return {
    host: parseEnvHost(env.HOST),
    port: parseEnvPort(env.PORT)
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  
  const env = loadEnv(mode, process.cwd(), '');
  const envConfig = parseEnvConfig(env);

  return {
    plugins: [react()],
    server: {
      host: envConfig.host,
      port: envConfig.port
    }
  };
})
