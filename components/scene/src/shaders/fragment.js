export function fragmentShader() {
    return `
      uniform float time;
      varying vec3 pos;
      uniform vec3 fogColor;
      uniform float fogNear;
      uniform float fogFar;
      
      void main() {
        float depth = gl_FragCoord.z / gl_FragCoord.w;
        float fogFactor = smoothstep( fogNear, fogFar, depth );
        gl_FragColor = vec4(0.5 + 0.5 * cos(time+pos.y+vec3(0, 2, 4)), 1.0);
        gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
      }
  `
}