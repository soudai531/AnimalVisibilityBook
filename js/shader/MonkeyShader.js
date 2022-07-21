import { VERTEX_SHADER } from "./ShaderUtil.js";

// 自作のシェダーテスト

// language=GLSL
const FRAGMENT_SHADER = `
varying vec2 vUv;
uniform sampler2D tDiffuse;

// x=赤、y=青、z=緑
void main() {
  vec4 color = texture2D(tDiffuse, vUv);
  gl_FragColor = vec4(0,color.y,color.z, 1.0);
}
`;

/**
 * Monochrome Fragment Shader.
 * @author Yasunobu Ikeda
 */
export class MonkeyShader {
  constructor() {
    this.uniforms = {
      tDiffuse: { type: "t", value: null }
    };

    this.vertexShader = VERTEX_SHADER;
    this.fragmentShader = FRAGMENT_SHADER;
  }
}
