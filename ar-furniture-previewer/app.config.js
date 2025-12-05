/**
 * Expo App Configuration
 * 
 * Handles environment-specific configuration including 8th Wall API key injection.
 * API keys are injected via EAS secrets (FR-045: never committed to repo).
 * 
 * @see https://docs.expo.dev/versions/latest/config/app/
 */

export default ({ config }) => {
  const appEnv = process.env.APP_ENV || 'development';

  return {
    ...config,
    extra: {
      ...config.extra,
      // Environment
      appEnv,

      // 8th Wall API Key (injected via EAS secrets, never in repo - FR-045)
      eighthWallApiKey: process.env.EIGHTH_WALL_API_KEY || '',

      // Lightship API Key (optional - for VPS/scanning)
      lightshipApiKey: process.env.LIGHTSHIP_API_KEY || '',

      // Feature flags per environment
      features: {
        debugAR: appEnv === 'development',
        analyticsEnabled: appEnv === 'production',
        crashReportingEnabled: appEnv !== 'development',
      },

      // API endpoints per environment
      api: {
        // Add any API endpoints here if needed
      },
    },
    hooks: {
      postPublish: [
        {
          file: 'sentry-expo/upload-sourcemaps',
          config: {
            organization: 'your-org',
            project: 'ar-furniture-previewer',
          },
        },
      ],
    },
  };
};
