type AnalyticValue = string | number | boolean | undefined;

type AnalyticsPayload = Record<string, AnalyticValue>;

export const analytics = {
  track: (event: string, payload: AnalyticsPayload = {}) => {
    if (__DEV__) {
      console.info('[analytics]', event, payload);
    }
  },
};

export const logOnboardingEvent = (event: string, payload: AnalyticsPayload = {}) => {
  analytics.track(event, payload);
};
