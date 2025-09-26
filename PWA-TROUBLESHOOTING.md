# PWA Install Prompt Troubleshooting Guide

## Common Issues Why Install Prompt Doesn't Appear on Production

### 1. **HTTPS Requirement**
- PWAs **require HTTPS** to function properly
- Localhost is exempt from this rule (that's why it works locally)
- Check: `window.location.protocol === 'https:'`

### 2. **Service Worker Registration Issues**
- Service worker must be registered successfully
- Check in DevTools → Application → Service Workers
- Look for registration errors in console

### 3. **Manifest Issues**
- Manifest must be accessible and valid
- Required fields: `name`, `start_url`, `display`, `icons`
- Icons must include at least 192x192 and 512x512 sizes
- Check in DevTools → Application → Manifest

### 4. **Browser Requirements**
- Chrome/Edge: Full support
- Safari: Limited support (iOS 16.4+)
- Firefox: Recent support (v58+)

### 5. **Install Criteria Not Met**
Chrome requires:
- Valid manifest with required fields
- Service worker with fetch event handler
- Served over HTTPS
- Not already installed
- User engagement (user must interact with the page)

### 6. **Already Installed or Seen**
- Browser remembers if user dismissed prompt
- Check localStorage for install-related flags
- Clear browser data to reset

### 7. **User Engagement Required**
- Some browsers require user interaction before showing prompt
- User must click/tap something on the page first

## Debugging Steps

### 1. Check DevTools Console
Look for errors related to:
- Service worker registration
- Manifest parsing
- Icon loading failures

### 2. Lighthouse PWA Audit
- Run Lighthouse audit in DevTools
- Check "Progressive Web App" section
- Address any failing criteria

### 3. Application Tab in DevTools
- **Manifest**: Verify all fields are correct
- **Service Workers**: Ensure registration is successful
- **Storage**: Clear localStorage/sessionStorage if needed

### 4. Network Tab
- Verify manifest.json loads without errors
- Check that all icons load successfully
- Ensure service worker file is accessible

### 5. Test Install Manually
In Chrome DevTools:
- Go to Application tab
- Click "Install" button next to app name
- If disabled, shows why criteria not met

## Production Deployment Checklist

- [ ] Site served over HTTPS
- [ ] Manifest file accessible at correct path
- [ ] All icon files load without 404 errors
- [ ] Service worker registers successfully
- [ ] No console errors related to PWA
- [ ] Lighthouse PWA audit passes
- [ ] Test on actual mobile device
- [ ] Clear browser cache/storage before testing

## Debug Components Added

The app now includes debug components for production troubleshooting:

### PWADebugger Component
- Shows PWA criteria checklist
- Displays manifest validation results
- Shows browser compatibility info
- Only appears in production builds

### Enhanced PWAInstallPrompt
- Logs debug information to console
- Shows why prompt might not appear
- Includes localStorage management

## Common Solutions

### For Vercel/Netlify Deployment
```javascript
// Add to vercel.json or netlify.toml
{
  "headers": [
    {
      "source": "/manifest.json",
      "headers": [
        {
          "key": "Content-Type",
          "value": "application/manifest+json"
        }
      ]
    }
  ]
}
```

### Clear Install Flags
```javascript
// Clear all PWA-related localStorage
localStorage.removeItem('pwa-install-prompt-seen');
localStorage.removeItem('pwa-install-declined');
localStorage.removeItem('pwa-install-success');
```

### Force Install Prompt (for testing)
```javascript
// In console (Chrome only)
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  e.prompt();
});
```

## Testing on Different Devices

### Desktop (Chrome/Edge)
- Install prompt appears in address bar
- Can also install via menu → Install app

### Mobile (Android)
- Install banner appears at bottom
- Can install via browser menu

### Mobile (iOS Safari)
- Add to Home Screen via share menu
- No automatic install prompt
- Requires manual user action