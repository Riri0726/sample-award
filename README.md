# Award 3D Viewer

A sophisticated 3D award viewer built with Three.js that allows users to explore a 3D model through discrete viewing angles controlled by a slider interface.

## Features

- **Interactive 3D Model**: Smooth rotation between 5 preset viewing angles
- **Intuitive Controls**: 
  - Slider for direct angle selection
  - Previous/Next buttons
  - Keyboard arrow key navigation
  - Mouse orbit controls for free exploration
- **Auto-rotation Mode**: Continuous rotation for presentation purposes
- **Responsive Design**: Works on desktop and mobile devices
- **Fallback Model**: Built-in trophy model if your GLB file isn't available
- **Performance Optimized**: Smooth animations with proper shadow mapping

## Quick Start

1. **Place your 3D model**: Export your award from Blender as `award.glb` and place it in the project folder
2. **Open in browser**: Simply open `index.html` in a modern web browser
3. **Interact**: Use the slider, buttons, or arrow keys to explore different angles

## File Structure

```
├── index.html          # Main HTML structure
├── style.css           # Complete styling and responsive design
├── main.js             # Three.js application logic
├── award.glb           # Your 3D model (place here)
└── README.md           # This file
```

## Blender Export Guidelines

For best results when exporting from Blender:

### Pre-export Checklist
- **Apply transforms**: Press `Ctrl+A` → "All Transforms" to bake scale/rotation
- **Set origin**: Place object origin where you want it to rotate around
- **Optimize geometry**: Use Decimate modifier if polycount is high
- **Use Principled BSDF**: For proper PBR materials

### Export Settings
- **Format**: glTF Binary (.glb)
- **Include**: Selected Objects
- **Compression**: Enable KHR_draco_mesh_compression for smaller files
- **Materials**: Include materials and textures
- **Animation**: Not needed for this viewer

### Recommended Model Properties
- **Polycount**: 5,000-50,000 triangles (balance quality vs performance)
- **Texture Resolution**: 1024x1024 or 2048x2048 max
- **Material**: Single Principled BSDF material preferred

## Customization Options

### Modify Viewing Angles
Edit the `slideAngles` array in `main.js`:
```javascript
const slideAngles = [0, Math.PI * 0.4, Math.PI * 0.8, Math.PI * 1.2, Math.PI * 1.6];
```

### Adjust Model Position
Change the positioning in the `loadModel()` function:
```javascript
award.position.set(-1.5, 0, 0); // x, y, z coordinates
```

### Customize Colors and Styling
Modify `style.css` to match your brand colors:
- Background gradients
- Button colors
- Panel styling
- Font choices

## Browser Requirements

- **Modern browsers** with WebGL support
- **ES6 modules** support
- **Recommended**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

## Performance Tips

1. **Optimize your GLB**:
   - Use Draco compression
   - Reduce texture sizes for web
   - Limit polycount appropriately

2. **Test on target devices**:
   - Mobile performance may require lower-poly models
   - Consider providing multiple quality levels

3. **Monitor loading times**:
   - GLB files over 5MB may need optimization
   - Consider showing loading progress

## Troubleshooting

### Model not loading?
- Ensure `award.glb` is in the same folder as `index.html`
- Check browser console for error messages
- Verify GLB file isn't corrupted
- A fallback trophy model will appear if GLB loading fails

### Performance issues?
- Reduce model polycount in Blender
- Lower texture resolution
- Disable shadows on mobile (edit lighting setup)

### Styling issues?
- Check browser compatibility
- Verify CSS is loading correctly
- Test responsive behavior on different screen sizes

## Next Steps

Ready for more advanced features? Consider adding:

- **HDRI Environment Lighting**: For photorealistic reflections
- **Animation Support**: Blend between different poses
- **AR/VR Integration**: Using WebXR APIs
- **React Integration**: Convert to React component
- **Multiple Models**: Load different awards dynamically

## License

Free to use and modify for your projects.

---

*This viewer was designed to showcase 3D awards with professional presentation quality while maintaining excellent performance across devices.*
