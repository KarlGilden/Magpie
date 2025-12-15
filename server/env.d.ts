declare namespace NodeJS {
    interface ProcessEnv {
        NODE_ENV: 'development' | 'production' | 'test';
        SESSION_SECRET: string;
        URL: string;
        PORT: string;
        DB_HOST: string;
        DB_USER: string;
        DB_PASSWORD: string;
        DB_NAME: string;

        GOOGLE_CLOUD_PROJECT_ID: string;
        GOOGLE_CLOUD_LOCATION: string;
        GOOGLE_CLOUD_PROCESSOR_ID: string;
        GOOGLE_APPLICATION_CREDENTIALS: string;

        OPENAI_API_KEY: string;
        OPENAI_MODEL: string;
        OPENAI_ORGANIZATION: string;
    }
}