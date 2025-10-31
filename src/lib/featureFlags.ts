// Feature flags configuration

export const featureFlags = {
  useMocks: import.meta.env.VITE_FLAG_USE_MOCKS === 'true',
  showDebugInfo: import.meta.env.DEV,
};
