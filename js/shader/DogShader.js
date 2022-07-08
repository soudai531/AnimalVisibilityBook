import { VERTEX_SHADER } from "./ShaderUtil.js";

// 自作のシェダーテスト

// language=GLSL
const FRAGMENT_SHADER = `
varying vec2 vUv;
uniform sampler2D tDiffuse;

// x=赤、y=青、z=緑
void main() {
  vec4 color = texture2D(tDiffuse, vUv);
  color.x = color.x > 0.04045 ? pow(((color.x + 0.055) / 1.055), 2.4) : (color.x / 12.92);
  color.y = color.y > 0.04045 ? pow(((color.y + 0.055) / 1.055), 2.4) : (color.y / 12.92);
  color.z = color.z > 0.04045 ? pow(((color.z + 0.055) / 1.055), 2.4) : (color.z / 12.92);




  //XYZからRGBに変換
  color.x = color.x>0.0032308 ? (1.055*pow(color.x,1/2.4)-0.055) : color.x*12.92;
  color.y = color.y>0.0032308 ? (1.055*pow(color.y,1/2.4)-0.055) : color.y*12.92;
  color.z = color.z>0.0032308 ? (1.055*pow(color.z,1/2.4)-0.055) : color.z*12.92;


  // 出力
  gl_FragColor = vec4(color.x , color.y, color.z, 0.5);
}
`;

/**
 * Monochrome Fragment Shader.
 * @author Yasunobu Ikeda
 */
export class DogShader {
  constructor() {
    this.uniforms = {
      tDiffuse: { type: "t", value: null }
    };

    this.vertexShader = VERTEX_SHADER;
    this.fragmentShader = FRAGMENT_SHADER;

  }
}
