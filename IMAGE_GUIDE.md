# Local Images Directory Structure

I've created the following directory structure for local images:

```
public/
  images/
    museums/
      reina-sofia.jpg
      prado.jpg
    artworks/
      guernica.jpg
      spanish-republic.jpg
      spanish-peasant.jpg
      war-series.jpg
      maternal.jpg
      memory-civil-war.jpg
      las-meninas.jpg
      third-of-may.jpg
      garden-earthly-delights.jpg
      naked-maja.jpg
      surrender-breda.jpg
```

## Image Requirements

### Museum Cover Images:
- **reina-sofia.jpg**: Cover image for Museo Reina Sofía
- **prado.jpg**: Cover image for Museo del Prado

### Artwork Images (Reina Sofía):
- **guernica.jpg**: Guernica by Pablo Picasso
- **spanish-republic.jpg**: The Spanish Republic by Joan Miró
- **spanish-peasant.jpg**: Spanish Peasant by Alberto Sánchez
- **war-series.jpg**: War Series by Horacio Ferrer
- **maternal.jpg**: Maternal by Julio González
- **memory-civil-war.jpg**: Memory of the Civil War by Antoni Tàpies

### Artwork Images (Prado):
- **las-meninas.jpg**: Las Meninas by Diego Velázquez
- **third-of-may.jpg**: The Third of May 1808 by Francisco Goya
- **garden-earthly-delights.jpg**: The Garden of Earthly Delights by Hieronymus Bosch
- **naked-maja.jpg**: The Naked Maja by Francisco Goya
- **surrender-breda.jpg**: The Surrender of Breda by Diego Velázquez

## Performance Benefits

Using local images instead of external Pexels URLs provides:
- ✅ **Better performance** - No external HTTP requests
- ✅ **Offline functionality** - Images load without internet
- ✅ **Reliability** - No dependency on external services
- ✅ **Control** - Use actual museum artwork images
- ✅ **Consistency** - Proper image dimensions and quality

## Next Steps

1. Save your museum/artwork images to the appropriate directories
2. Update `src/App.tsx` to use the local image paths (replace Pexels URLs with `/images/...` paths)
3. The app will automatically serve images from the `public/images/` directory