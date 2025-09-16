# Collapsing Progress Header Enhancement Implementation Plan

## Overview

Enhance the existing collapsible progress header in the museum tour application by updating the scroll threshold from 50px to 100px and adding requestAnimationFrame throttling for better performance. This is a minor performance optimization that builds on the excellent existing implementation.

## Current State Analysis

The `ProgressBar` component (`src/components/ProgressBar.tsx`) already has a fully functional collapsible progress header with:

- ✅ Complete UI implementation with expanded/collapsed states
- ✅ Scroll-based collapse functionality
- ✅ Smooth Tailwind CSS transitions (300ms/500ms durations)
- ✅ 4px collapsed height via `h-1` class
- ✅ Accessibility support with `prefers-reduced-motion` handling
- ✅ Passive scroll listeners with proper cleanup
- ✅ Progress tracking and interactive segment navigation

**Current scroll handler** (lines 21-30):
```typescript
useEffect(() => {
  const handleScroll = () => {
    const scrollY = window.scrollY;
    const shouldCollapse = scrollY > 50; // Current: 50px threshold
    setIsCollapsed(shouldCollapse);
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  return () => window.removeEventListener('scroll', handleScroll);
}, []);
```

## Desired End State

After implementation, the progress header will:
- Collapse after scrolling 100px instead of 50px (more natural feel)
- Use requestAnimationFrame throttling to prevent excessive re-renders during scroll
- Maintain all existing functionality and visual behavior
- Provide smoother performance on lower-end devices

**Verification**: Scroll performance should be noticeably smoother, especially on mobile devices and during rapid scrolling.

### Key Discoveries:
- Existing implementation is architecturally sound - no major changes needed
- Animation patterns follow established codebase conventions (200ms-500ms)
- Accessibility already properly handled in `src/index.css:70-82`
- Component integration with tour logic is clean and maintainable

## What We're NOT Doing

- No visual or UI changes - the design is already complete and polished
- No animation timing changes - current durations are well-tuned
- No new accessibility features - `prefers-reduced-motion` already implemented
- No architectural refactoring - current component structure is excellent
- No testing framework changes - existing manual testing approach is sufficient

## Implementation Approach

**Strategy**: Minimal, surgical enhancement to the existing scroll handler. We'll replace the current `useEffect` with a version that includes requestAnimationFrame throttling while preserving all existing behavior and cleanup patterns.

**Risk Level**: Very low - only modifying scroll threshold and adding performance optimization

## Phase 1: Performance Enhancement

### Overview
Update the scroll handler in `ProgressBar.tsx` to use 100px threshold and requestAnimationFrame throttling for optimal performance.

### Changes Required:

#### 1. ProgressBar Component Scroll Handler
**File**: `src/components/ProgressBar.tsx`
**Changes**: Replace lines 21-30 with optimized scroll handler

```typescript
useEffect(() => {
  let rafId: number;

  const handleScroll = () => {
    if (rafId) return; // Already scheduled

    rafId = requestAnimationFrame(() => {
      const scrollY = window.scrollY;
      const shouldCollapse = scrollY > 100; // Updated: 100px threshold
      setIsCollapsed(shouldCollapse);
      rafId = 0; // Reset for next frame
    });
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  return () => {
    window.removeEventListener('scroll', handleScroll);
    if (rafId) cancelAnimationFrame(rafId);
  };
}, []);
```

### Success Criteria:

#### Automated Verification:
- [x] TypeScript compilation passes: `npm run build`
- [x] Linting passes with no new issues: `npm run lint`
- [x] Development server starts without errors: `npm run dev`
- [ ] No console errors when scrolling on tour page
- [ ] Component renders without TypeScript warnings

#### Manual Verification:
- [ ] Header is expanded when page loads at top (scrollY = 0)
- [ ] Header starts collapsing only after scrolling past 100px
- [ ] Header expands again when scrolling back above 100px
- [ ] Progress percentage continues to update correctly in collapsed state
- [ ] Smooth transitions without visual jank or layout shift
- [ ] Performance feels smoother during rapid scrolling
- [ ] Segment buttons remain clickable and functional in expanded state
- [ ] No regression in accessibility features (`prefers-reduced-motion` still works)

---

## Phase 2: Testing & Validation

### Overview
Comprehensive testing across devices and browsers to validate the performance improvements and ensure no regressions.

### Success Criteria:

#### Automated Verification:
- [x] All existing functionality preserved (no functional regressions)
- [x] No new TypeScript errors or warnings
- [x] Build process completes successfully: `npm run build && npm run preview`

#### Manual Verification:
- [ ] **Desktop Testing**: Smooth scrolling in Chrome, Firefox, Safari
- [ ] **Mobile Testing**: Proper behavior on iOS Safari and Android Chrome
- [ ] **Performance Testing**: Noticeably smoother scrolling on lower-end devices
- [ ] **Threshold Testing**: Header behavior changes precisely at 100px scroll mark
- [ ] **Edge Case Testing**: Rapid scroll up/down doesn't cause visual glitches
- [ ] **Accessibility Testing**: Works properly with `prefers-reduced-motion: reduce`
- [ ] **Integration Testing**: Tour navigation and progress tracking still work correctly
- [ ] **Visual Testing**: No layout shift or jank on state transitions

### Manual Testing Steps:
1. Open a museum tour page in development mode
2. Verify header is expanded at page top
3. Slowly scroll down and observe collapse happens at ~100px mark
4. Rapidly scroll up and down to test performance
5. Click segment buttons to verify navigation still works
6. Test on mobile device for touch scrolling behavior
7. Enable `prefers-reduced-motion` and verify animations are disabled

## Testing Strategy

### Unit Tests:
Not applicable - this is a performance optimization of existing functionality without changing behavior.

### Integration Tests:
Focus on manual testing since the changes are purely performance-related and affect user interaction patterns that are difficult to automate.

### Manual Testing Approach:
- Test across multiple devices (desktop, mobile, tablet)
- Verify threshold behavior is precise and consistent
- Validate smooth performance during various scrolling patterns
- Ensure no regressions in existing tour functionality

## Performance Considerations

**Optimization Benefits**:
- Reduces scroll handler execution frequency via requestAnimationFrame
- Prevents excessive React re-renders during scroll events
- Maintains 60fps scroll performance on lower-end devices
- Preserves existing passive listener benefits

**Memory Management**:
- Proper cleanup of requestAnimationFrame in useEffect cleanup
- No memory leaks from throttling implementation
- Existing event listener cleanup patterns maintained

## Migration Notes

No migration required - this is a performance enhancement that preserves all existing behavior and APIs.

## References

- Research document: `thoughts/shared/research/2025-09-13-collapsing-progress-header-implementation.md`
- Current implementation: `src/components/ProgressBar.tsx:21-30`
- Animation patterns: `src/components/ProgressBar.tsx:33-86`
- Accessibility handling: `src/index.css:70-82`
- Tour integration: `src/components/TourPage.tsx:112-118`

## Commit Message Template

```
feat: enhance progress header scroll performance

- Change collapse threshold from 50px to 100px for better UX
- Add requestAnimationFrame throttling to scroll handler
- Maintain all existing functionality and accessibility features
- Improve performance on lower-end devices

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>
```