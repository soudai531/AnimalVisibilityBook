/**
 * @author Nozomi Nohara / http://github.com/ics-nohara
 * 画面上に表示するオブジェクトをまとめたクラスです。
 */
export class TestObjects {
  constructor(scene, renderer) {
    this.renderer = renderer;
    this.meshImage = this.createImagePlane();
    this.meshVideo = this.createVideoPlane();

    scene.add(this.meshImage);
    scene.add(this.meshVideo);

    this.meshImage.visible = false;
    this.meshVideo.visible = true;

    this.currentType = "video";
  }

  change(type) {
    this.currentType = type;

    switch (type) {
      case "video":
        this.video.play();
        this.meshImage.visible = false;
        this.meshVideo.visible = true;
        break;
      case "image":
        this.video.pause();
        this.meshImage.visible = true;
        this.meshVideo.visible = false;
        break;
      default:
        throw new Error();
    }
  }

  createVideoPlane() {
    //video要素とそれをキャプチャするcanvas要素を生成
    const video = document.getElementById("video")
    // カメラから映像を取得
    var constraints = {
      audio: false,
      video: {
        // スマホのバックカメラを使用
        facingMode: 'environment'
      }
    };
    navigator.mediaDevices.getUserMedia(constraints).
      then(stream => {
        video.srcObject = stream;
        video.play()
      }).catch(e => {
        console.log(e)
      })

    this.video = document.getElementById("video");
    this.video.volume = 0;
    const canvas = document.createElement("canvas");
    canvas.width = 1280;
    canvas.height = 720;

    this.videoCanvasContext = canvas.getContext("2d");
    this.videoCanvasContext.fillStyle = "#000000";
    this.videoCanvasContext.fillRect(0, 0, canvas.width, canvas.height);

    //生成したcanvasをtextureとしてTHREE.Textureオブジェクトを生成
    this.videoTexture = new THREE.Texture(canvas);
    this.videoTexture.minFilter = THREE.LinearFilter;
    this.videoTexture.magFilter = THREE.LinearFilter;

    //生成したvideo textureをmapに指定し、overdrawをtureにしてマテリアルを生成
    const movieMaterial = new THREE.MeshBasicMaterial({
      map: this.videoTexture,
      side: THREE.DoubleSide
    });

    const movieGeometry = new THREE.PlaneBufferGeometry(32, 18);
    const movieScreen = new THREE.Mesh(movieGeometry, movieMaterial);
    movieScreen.scale.setLength(0.5);

    const group = new THREE.Group();
    group.add(movieScreen);
    group.visible = true;
    return group;
  }

  createImagePlane() {
    const group = new THREE.Group();
    const texture = new THREE.TextureLoader().load(
      "img/flower_1024x1024.jpg"
    );

    texture.anisotropy = this.renderer.getMaxAnisotropy();

    const geometry = new THREE.PlaneBufferGeometry(10.0, 10.0);
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.DoubleSide
    });
    const mesh = new THREE.Mesh(geometry, material);
    group.add(mesh);
    group.visible = false;
    return group;
  }

  onUpdate() {
    //loop updateの中で実行
    if (this.currentType === "image") {
      return;
    }

    if (this.video.readyState === this.video.HAVE_ENOUGH_DATA) {
      this.videoCanvasContext.drawImage(this.video, 0, 0);
      this.videoTexture.needsUpdate = true;
    }
  }
}
