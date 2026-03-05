import { ShaderGradientCanvas, ShaderGradient } from '@shadergradient/react';
import * as reactSpring from '@react-spring/three';

export default function ShaderGradientBackground() {
  return (
    <ShaderGradientCanvas
      importedFiber={{ ...reactSpring }}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
      pixelDensity={1}
      fov={45}
    >
      <ShaderGradient
        control='query'
        urlString='https://shadergradient.co/customize?animate=on&axesHelper=off&bgColor1=%23000000&bgColor2=%23000000&brightness=2.3&cAzimuthAngle=180&cDistance=2.8&cPolarAngle=80&cameraZoom=13.7&color1=%23c37b48&color2=%23c861ca&color3=%238500d2&destination=onCanvas&embedMode=off&envPreset=city&format=gif&fov=45&frameRate=10&gizmoHelper=hide&grain=on&lightType=env&pixelDensity=1&positionX=0&positionY=0&positionZ=0&range=disabled&rangeEnd=40&rangeStart=0&reflection=0.6&rotationX=50&rotationY=0&rotationZ=-60&shader=defaults&type=sphere&uAmplitude=0&uDensity=1.5&uFrequency=0&uSpeed=0.05&uStrength=1.5&uTime=8&wireframe=false'
      />
    </ShaderGradientCanvas>
  );
}
