declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'local' | 'test' | 'development' | 'staging' | 'uat' | 'production';
      PORT: string;

      // DATABASE CONNECTIONS
      DB_HOST_PAYMENT: string;
      DB_PORT_PAYMENT: string;
      DB_DATABASE_PAYMENT: string;
      DB_USERNAME_PAYMENT: string;
      DB_PASSWORD_PAYMENT: string;

    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
