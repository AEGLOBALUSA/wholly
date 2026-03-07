import React, { createContext, useContext, useEffect, useCallback, useRef } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import { analyticsService, analytics } from '../services/analytics';
import { useAuth } from './AuthContext';

interface AnalyticsContextType {
  trackEvent: (eventName: string, properties?: Record<string, any>, screenName?: string) => Promise<void>;
  trackPageView: (screenName: string) => Promise<void>;
  flush: () => Promise<void>;
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

export const AnalyticsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, profile } = useAuth();
  const navigation = useNavigation();
  const route = useRoute();
  const isInitializedRef = useRef(false);

  // Initialize analytics and set user ID
  useEffect(() => {
    if (!isInitializedRef.current) {
      analyticsService.init(user?.id || profile?.id);
      isInitializedRef.current = true;
    } else if (user?.id || profile?.id) {
      analyticsService.setUserId(user?.id || profile?.id || null);
    }
  }, [user?.id, profile?.id]);

  // Auto-track page views on navigation
  useEffect(() => {
    const unsubscribe = navigation.addListener('state', () => {
      const routeName = route.name;
      if (routeName) {
        analyticsService.track('page_view', { screen_name: routeName }, routeName);
      }
    });

    return unsubscribe;
  }, [navigation, route]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      analyticsService.destroy();
    };
  }, []);

  const trackEvent = useCallback(
    async (eventName: string, properties?: Record<string, any>, screenName?: string) => {
      await analyticsService.track(eventName, properties, screenName);
    },
    [],
  );

  const trackPageView = useCallback(
    async (screenName: string) => {
      await analyticsService.track('page_view', { screen_name: screenName }, screenName);
    },
    [],
  );

  const flush = useCallback(async () => {
    await analyticsService.flush();
  }, []);

  return (
    <AnalyticsContext.Provider value={{ trackEvent, trackPageView, flush }}>
      {children}
    </AnalyticsContext.Provider>
  );
};

/**
 * Hook to use analytics in components
 */
export const useAnalytics = (): AnalyticsContextType => {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalytics must be used within AnalyticsProvider');
  }
  return context;
};

/**
 * Export convenience methods from analytics service
 */
export { analytics };
