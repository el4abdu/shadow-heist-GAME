"use client";

/**
 * Safe API wrapper to handle empty API objects during build time
 * This is a workaround for the issue where the Convex API object is empty during build time
 */

export const safeApi = (api: any) => {
  // If api is not defined or empty, return a proxy that returns undefined for any property access
  if (!api || Object.keys(api).length === 0) {
    return new Proxy({}, {
      get: (target, prop) => {
        // If property is rooms, return a proxy for rooms
        if (prop === 'rooms') {
          return new Proxy({}, {
            get: () => () => {
              console.warn('API is not initialized yet');
              return Promise.resolve({});
            }
          });
        }
        return undefined;
      }
    });
  }
  
  // Otherwise, return the actual API
  return api;
}; 