import { MonkeyShader } from "./shader/MonkeyShader.js";
import { DogShader } from "./shader/DogShader.js";
import { TestObjects } from "./TestObjects.js";

//  HTML読み込みと解析が完了したとき
window.addEventListener("DOMContentLoaded", () => {
  const main = new Main();
  main.initialize();
});

//外部のクラスを読み込む
export class Main {
  constructor() {
    this.effects = {};
    this.effectList = [];
  }

  initialize() {
    this.initVue();
    this.init3d();
  }

  initVue() {
    // v-repeat
    new Vue({
      el: "#myapp",
      data: {
        shaderTypes: [

          { name: "イヌ", id: "dog", value: false },
          { name: "ネコ", id: "cat", value: false },
          { name: "サル", id: "monkey", value: false }
        ],
        picked: "video"
      },
      methods: {
        //チェックボックスリスナー
        onChangeShaderCheckbox: item => {
          item.value = !item.value;
          if ((item.id == "dog" && item.value == true) || (item.id == "cat" && item.value == true)) {
            alert("現在開発中です。");
          }

          if (item.id == "monkey") {
            this.changeShader(item.id, item.value);
          }
        }
      }
    });
  }


  initObjects() {
    this.objects = new TestObjects(this.scene, this.renderer, this.spMode);
    if (this.spMode) {
      const changeButton = document.getElementById("object_change");
      changeButton.style.display = "none";
    }
  }

  resetShader() {
    this.normalRenderMode = true;
    for (let i = 0; i < this.effectList.length; i++) {
      this.effectList[i].pass.enabled = false;
      this.effectList[i].pass.renderToScreen = false;
    }
  }

  changeShader(id, value) {
    this.normalRenderMode = false;
    this.effects[id].pass.enabled = value;
    let renderToScreen = false;
    for (let i = this.effectList.length - 1; i >= 0; i--) {
      if (this.effectList[i].pass.enabled && !renderToScreen) {
        this.effectList[i].pass.renderToScreen = true;
        renderToScreen = true;
      } else {
        this.effectList[i].pass.renderToScreen = false;
      }
    }
    if (!renderToScreen) {
      this.normalRenderMode = true;
    }
  }

  //  Three.jsの初期化処理
  init3d() {
    //シーンの作成
    this.scene = new THREE.Scene();
    //カメラの作成(画角、アスペクト比、カメラからの距離、カメラから奥までの距離)
    this.camera = new THREE.PerspectiveCamera(
      100,
      640 / 480,
      0.1,
      1000
    );
    //レンダラーを作成
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    // セットするサイズを指定
    this.renderer.setSize(480, 640);
    // 
    this.renderer.setPixelRatio(window.devicePixelRatio);
    // DOMオブジェクトを取得
    document
      .getElementById("canvas-wrapper")
      .appendChild(this.renderer.domElement);

    this.initObjects();
    // postprocessing
    this.composer = new THREE.EffectComposer(this.renderer);
    this.composer.addPass(new THREE.RenderPass(this.scene, this.camera));
    this.addShaders();
    this.normalRenderMode = true;
    this.camera.position.z = 2.2;

    this.render();
  }

  render() {
    requestAnimationFrame(() => {
      this.render();
    });
    if (this.normalRenderMode) {
      this.renderer.render(this.scene, this.camera);
    } else {
      this.composer.render();
    }
    this.objects.onUpdate();
  }

  addShaders() {
    const width = 480;
    const height = 640;
    this.addEffect("dog", new DogShader());
    this.addEffect("monkey", new MonkeyShader());

  }

  addEffect(name, shader) {
    const pass = new THREE.ShaderPass(shader);
    this.composer.addPass(pass);
    pass.renderToScreen = false;
    pass.enabled = false;
    this.effects[name] = { material: shader, pass: pass };
    //  順番用
    this.effectList.push(this.effects[name]);
  }
}
