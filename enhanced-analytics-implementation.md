# Enhanced Analytics Implementation

## 1. Enhanced Audio Analytics

### A. Audio Engagement Segments
Add to `src/lib/analytics.ts`:

```typescript
// Enhanced audio tracking with segments
export const MuseumAnalytics = {
  // ... existing methods ...

  // Track audio progress at key milestones
  trackAudioProgress: (
    tourId: string,
    stopId: string,
    audioType: 'artwork' | 'artist',
    progressPercent: number,
    duration: number
  ) => {
    // Track at 25%, 50%, 75%, 100% milestones
    const milestones = [25, 50, 75, 100];
    const currentMilestone = milestones.find(m =>
      progressPercent >= m && progressPercent < m + 5
    );

    if (currentMilestone) {
      trackEvent('audio_milestone', 'audio_engagement', `${currentMilestone}%`, currentMilestone, {
        tour_id: tourId,
        stop_id: stopId,
        audio_type: audioType,
        duration_seconds: duration,
        milestone: currentMilestone
      });
    }
  },

  // Track audio seek behavior
  trackAudioSeek: (
    tourId: string,
    stopId: string,
    audioType: 'artwork' | 'artist',
    fromTime: number,
    toTime: number
  ) => {
    const seekDirection = toTime > fromTime ? 'forward' : 'backward';
    const seekDistance = Math.abs(toTime - fromTime);

    trackEvent('audio_seek', 'audio_interaction', seekDirection, seekDistance, {
      tour_id: tourId,
      stop_id: stopId,
      audio_type: audioType,
      from_time: fromTime,
      to_time: toTime,
      seek_distance: seekDistance
    });
  },

  // Track transcript interactions
  trackTranscriptInteraction: (
    tourId: string,
    stopId: string,
    audioType: 'artwork' | 'artist',
    action: 'open' | 'close' | 'scroll'
  ) => {
    trackEvent('transcript_interaction', 'content_engagement', action, undefined, {
      tour_id: tourId,
      stop_id: stopId,
      audio_type: audioType,
      interaction_type: action
    });
  },

  // Track audio quality issues
  trackAudioError: (
    tourId: string,
    stopId: string,
    audioType: 'artwork' | 'artist',
    errorType: 'loading' | 'playback' | 'network'
  ) => {
    trackEvent('audio_error', 'technical_issues', errorType, undefined, {
      tour_id: tourId,
      stop_id: stopId,
      audio_type: audioType,
      error_type: errorType,
      timestamp: Date.now()
    });
  }
};
```

### B. Enhanced Audio Player with Detailed Tracking
Update `src/components/CompactAudioPlayer.tsx`:

```typescript
// Add these props to CompactAudioPlayerProps interface
interface CompactAudioPlayerProps {
  // ... existing props ...
  tourId?: string;
  stopId?: string;
  audioType?: 'artwork' | 'artist';
  analyticsEnabled?: boolean;
}

// Add these state variables and tracking logic
const CompactAudioPlayer: React.FC<CompactAudioPlayerProps> = ({
  // ... existing props ...
  tourId,
  stopId,
  audioType,
  analyticsEnabled = false
}) => {
  // ... existing state ...
  const [lastMilestone, setLastMilestone] = useState(0);
  const analytics = useAnalytics();

  // Enhanced timeUpdate handler with milestone tracking
  const handleTimeUpdate = () => {
    setCurrentTime(audio.currentTime);
    const progressPercent = (audio.currentTime / duration) * 100;

    if (onProgressUpdate) {
      onProgressUpdate(progressPercent);
    }

    // Track progress milestones
    if (analyticsEnabled && tourId && stopId && audioType) {
      analytics.trackAudioProgress(tourId, stopId, audioType, progressPercent, duration);
    }
  };

  // Track seek events
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current || !duration) return;

    const oldTime = currentTime;
    const newTime = (parseFloat(e.target.value) / 100) * duration;

    // Track seek behavior
    if (analyticsEnabled && tourId && stopId && audioType && Math.abs(newTime - oldTime) > 5) {
      analytics.trackAudioSeek(tourId, stopId, audioType, oldTime, newTime);
    }

    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  // Track audio errors
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !analyticsEnabled) return;

    const handleError = () => {
      if (tourId && stopId && audioType) {
        analytics.trackAudioError(tourId, stopId, audioType, 'playback');
      }
    };

    const handleLoadError = () => {
      if (tourId && stopId && audioType) {
        analytics.trackAudioError(tourId, stopId, audioType, 'loading');
      }
    };

    audio.addEventListener('error', handleError);
    audio.addEventListener('loadstart', () => {
      // Track loading start for performance analysis
    });

    return () => {
      audio.removeEventListener('error', handleError);
    };
  }, [analyticsEnabled, tourId, stopId, audioType, analytics]);
};
```

## 2. User Journey Funnel Analytics

### A. Enhanced Navigation Tracking
Add to `src/lib/analytics.ts`:

```typescript
export const MuseumAnalytics = {
  // ... existing methods ...

  // Track time spent on pages
  trackPageDuration: (
    page: string,
    durationMs: number,
    context?: Record<string, any>
  ) => {
    trackEvent('page_duration', 'user_behavior', page, durationMs, {
      duration_seconds: Math.round(durationMs / 1000),
      ...context
    });
  },

  // Track funnel progression
  trackFunnelStep: (
    step: 'intro' | 'cities' | 'museums' | 'tours' | 'tour_started',
    stepNumber: number,
    context?: Record<string, any>
  ) => {
    trackEvent('funnel_step', 'conversion', step, stepNumber, {
      step_name: step,
      step_number: stepNumber,
      ...context
    });
  },

  // Track search behavior
  trackSearch: (
    query: string,
    resultsCount: number,
    context: 'tour_stops' | 'cities' | 'museums'
  ) => {
    trackEvent('search', 'user_interaction', context, resultsCount, {
      search_query: query.toLowerCase(),
      results_count: resultsCount,
      search_context: context
    });
  },

  // Track back navigation patterns
  trackNavigationPattern: (
    fromStep: string,
    toStep: string,
    method: 'back_button' | 'browser_back' | 'breadcrumb'
  ) => {
    trackEvent('navigation_pattern', 'user_behavior', `${fromStep}_to_${toStep}`, undefined, {
      from_step: fromStep,
      to_step: toStep,
      navigation_method: method
    });
  }
};
```

### B. Page Duration Tracking Hook
Create `src/hooks/usePageTracking.ts`:

```typescript
import { useEffect, useRef } from 'react';
import { useAnalytics } from './useAnalytics';

export const usePageTracking = (
  pageName: string,
  context?: Record<string, any>,
  analyticsEnabled: boolean = false
) => {
  const startTime = useRef<number>(Date.now());
  const analytics = useAnalytics();

  useEffect(() => {
    startTime.current = Date.now();

    return () => {
      if (analyticsEnabled) {
        const duration = Date.now() - startTime.current;
        analytics.trackPageDuration?.(pageName, duration, context);
      }
    };
  }, [pageName, analyticsEnabled, analytics, context]);

  // Track funnel progression
  useEffect(() => {
    if (analyticsEnabled) {
      const stepMapping = {
        'intro': 1,
        'cities': 2,
        'museums': 3,
        'tours': 4,
        'tour': 5
      };

      const stepNumber = stepMapping[pageName as keyof typeof stepMapping];
      if (stepNumber) {
        analytics.trackFunnelStep?.(pageName as any, stepNumber, context);
      }
    }
  }, [pageName, analyticsEnabled, analytics, context]);
};
```

## 3. Content Performance Analytics

### A. Content Engagement Tracking
Add to `src/lib/analytics.ts`:

```typescript
export const MuseumAnalytics = {
  // ... existing methods ...

  // Track content popularity
  trackContentEngagement: (
    contentType: 'city' | 'museum' | 'tour' | 'stop',
    contentId: string,
    contentName: string,
    engagementType: 'view' | 'select' | 'complete' | 'favorite',
    engagementValue?: number
  ) => {
    trackEvent('content_engagement', contentType, engagementType, engagementValue, {
      content_type: contentType,
      content_id: contentId,
      content_name: contentName,
      engagement_type: engagementType
    });
  },

  // Track user preferences
  trackUserPreference: (
    preferenceType: 'audio_speed' | 'transcript_usage' | 'tour_completion_style',
    preferenceValue: string | number
  ) => {
    trackEvent('user_preference', 'personalization', preferenceType, undefined, {
      preference_type: preferenceType,
      preference_value: preferenceValue
    });
  },

  // Track accessibility features usage
  trackAccessibilityUsage: (
    feature: 'transcript' | 'high_contrast' | 'large_text',
    action: 'enable' | 'disable' | 'use'
  ) => {
    trackEvent('accessibility_feature', 'accessibility', feature, undefined, {
      feature_type: feature,
      action: action
    });
  }
};
```

## 4. Performance Monitoring

### A. Performance Tracking
Create `src/lib/performanceAnalytics.ts`:

```typescript
import { MuseumAnalytics } from './analytics';

export const PerformanceAnalytics = {
  // Track page load performance
  trackPageLoad: () => {
    if ('performance' in window) {
      window.addEventListener('load', () => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;

        MuseumAnalytics.trackEvent('page_performance', 'performance', 'page_load', navigation.loadEventEnd, {
          dns_time: navigation.domainLookupEnd - navigation.domainLookupStart,
          connect_time: navigation.connectEnd - navigation.connectStart,
          request_time: navigation.responseEnd - navigation.requestStart,
          dom_ready: navigation.domContentLoadedEventEnd - navigation.navigationStart,
          total_load_time: navigation.loadEventEnd - navigation.navigationStart
        });
      });
    }
  },

  // Track resource loading (audio files)
  trackResourceLoad: (resourceType: 'audio' | 'image', resourceUrl: string, loadTime: number) => {
    MuseumAnalytics.trackEvent('resource_performance', 'performance', resourceType, loadTime, {
      resource_type: resourceType,
      resource_url: resourceUrl,
      load_time_ms: loadTime
    });
  },

  // Track Core Web Vitals
  trackWebVitals: () => {
    // This would integrate with web-vitals library
    // import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

    // getCLS((metric) => {
    //   MuseumAnalytics.trackEvent('web_vitals', 'performance', 'CLS', metric.value);
    // });
  }
};
```

## 5. Enhanced User Behavior Analytics

### A. Session Intelligence
Create `src/hooks/useAdvancedAnalytics.ts`:

```typescript
import { useEffect, useRef } from 'react';
import { useAnalytics } from './useAnalytics';

export const useAdvancedAnalytics = (analyticsEnabled: boolean = false) => {
  const analytics = useAnalytics();
  const sessionData = useRef({
    startTime: Date.now(),
    pageViews: 0,
    interactions: 0,
    audioPlays: 0,
    completions: 0
  });

  useEffect(() => {
    if (!analyticsEnabled) return;

    // Track scroll depth
    let maxScroll = 0;
    const handleScroll = () => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      );
      if (scrollPercent > maxScroll) {
        maxScroll = scrollPercent;
        // Track significant scroll milestones
        if ([25, 50, 75, 90].includes(scrollPercent)) {
          analytics.trackEvent?.('scroll_depth', 'engagement', `${scrollPercent}%`, scrollPercent);
        }
      }
    };

    // Track user engagement patterns
    const handleVisibilityChange = () => {
      if (document.hidden) {
        analytics.trackEvent?.('tab_visibility', 'user_behavior', 'hidden');
      } else {
        analytics.trackEvent?.('tab_visibility', 'user_behavior', 'visible');
      }
    };

    // Track device/network conditions
    const trackDeviceContext = () => {
      const connection = (navigator as any).connection;
      if (connection) {
        analytics.trackEvent?.('network_conditions', 'technical', connection.effectiveType, undefined, {
          effective_type: connection.effectiveType,
          downlink: connection.downlink,
          rtt: connection.rtt
        });
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    trackDeviceContext();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [analyticsEnabled, analytics]);

  return {
    trackCustomEvent: (eventName: string, properties: Record<string, any>) => {
      if (analyticsEnabled) {
        analytics.trackEvent?.(eventName, 'custom', undefined, undefined, properties);
      }
    }
  };
};
```

## 6. Implementation in Components

### A. Enhanced App.tsx Integration
Update key handlers in `src/App.tsx`:

```typescript
// Add to imports
import { usePageTracking } from './hooks/usePageTracking';
import { PerformanceAnalytics } from './lib/performanceAnalytics';

function App() {
  // ... existing state ...

  // Enhanced page tracking
  const pageContext = {
    cityName: selectedCity?.name,
    museumName: selectedMuseum?.name,
    tourName: selectedTour?.name,
  };

  usePageTracking(currentView, pageContext, analyticsEnabled);

  // Initialize performance tracking
  useEffect(() => {
    if (analyticsEnabled) {
      PerformanceAnalytics.trackPageLoad();
    }
  }, [analyticsEnabled]);

  // Enhanced selection handlers with content tracking
  const handleSelectCity = (city: City) => {
    setSelectedCity(city);
    setCurrentView('museums');
    pushHistoryState('museums', city);

    if (analyticsEnabled) {
      analytics.trackCitySelected(city);
      analytics.trackContentEngagement('city', city.id, city.name, 'select');
    }
  };

  // ... similar enhancements for other handlers
}
```

### B. Enhanced Tour Page Search Tracking
Update `src/components/TourPage.tsx`:

```typescript
// Add search tracking
const handleSearchChange = (query: string) => {
  setSearchQuery(query);

  if (analyticsEnabled && query.length > 2) {
    const results = allStops.filter(stop =>
      stop.title.toLowerCase().includes(query.toLowerCase()) ||
      (stop.artistName && stop.artistName.toLowerCase().includes(query.toLowerCase())) ||
      (stop.roomNumber && stop.roomNumber.toLowerCase().includes(query.toLowerCase()))
    );

    analytics.trackSearch(query, results.length, 'tour_stops');
  }
};
```

## 7. Custom Dashboards & Reports

### A. Key Performance Indicators (KPIs)
Set up custom Google Analytics 4 events to track:

1. **Conversion Funnel:**
   - Intro → Cities: `funnel_step` events
   - Cities → Museums → Tours → Tour Start

2. **Engagement Metrics:**
   - Average audio completion rate
   - Tour completion rate by museum/city
   - Session engagement score

3. **Content Performance:**
   - Most/least popular content
   - Drop-off points in tours
   - Search success rates

### B. Recommended GA4 Custom Reports
- **Audio Engagement Report:** Track audio milestones, completion rates
- **Tour Performance Dashboard:** Tour popularity, completion rates
- **User Journey Analysis:** Funnel conversion, drop-off analysis
- **Technical Performance:** Loading times, error rates
- **Accessibility Usage:** Feature adoption, user preferences

This implementation provides comprehensive analytics while maintaining your privacy-first approach and current architecture.