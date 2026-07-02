"use client";

/**
 * @fileOverview Client-side store to cache SMM services by platform.
 * This prevents re-fetching from the server on every navigation while ensuring
 * only relevant data is stored for each platform independently.
 */

const platformCache: Record<string, any[]> = {};

export const getCachedServices = (platformId: string) => {
  return platformCache[platformId] || null;
};

export const setCachedServices = (platformId: string, services: any[]) => {
  platformCache[platformId] = services;
};

export const clearServicesCache = (platformId?: string) => {
  if (platformId) {
    delete platformCache[platformId];
  } else {
    Object.keys(platformCache).forEach(key => delete platformCache[key]);
  }
};
