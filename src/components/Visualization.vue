<template>
        <canvas id="threeCanvas" ref="threeCanvas"></canvas>
</template>

<script>
import * as THREE from "three";

export default {
  name: "Visualization",
  data: () => ({
    wireframe: null
  }),

  methods: {
    init() {
      window.addEventListener("resize", this.handleResize.bind(this));
      this.$three.renderer = new THREE.WebGLRenderer({
        canvas: this.$refs.threeCanvas,
        antialias: true
      });
      this.handleResize();
      let geometry = new THREE.BoxGeometry(50, 50, 50);
      let mat = new THREE.MeshBasicMaterial({
        color: 0xfefefe,
        opacity: 0.5
      });
      this.wireframe = new THREE.Mesh(geometry, mat);
      this.$three.scene.add(this.wireframe);
      this.$three.renderer.render(this.$three.scene, this.$three.camera);
      this.wireframe.position.z = -100;
      this.render.bind(this)();
    },
    render() {
      window.requestAnimationFrame(this.render);
      this.$audio.analyser.getByteFrequencyData(this.$audio.dataArray);
      /*this.wireframe.color = new THREE.Color(
        this.$audio.dataArray[0] / 255,
        this.$audio.dataArray[20] / 255,
        this.$audio.dataArray[80] / 255
      );*/
      this.$three.renderer.render(this.$three.scene, this.$three.camera);
    },
    handleResize() {
      this.$refs.threeCanvas.width = window.outerWidth;
      this.$three.renderer.setSize(
        this.$refs.threeCanvas.width,
        this.$refs.threeCanvas.height,
        false
      );
      this.$three.camera.aspect =
        this.$refs.threeCanvas.width / this.$refs.threeCanvas.height;
      this.$three.camera.updateProjectionMatrix();
    }
  },
  mounted() {
    this.init();
  }
};
</script>

<style lang="scss">
#threeCanvas {
  width: inherit;
  height: 25vh;
  background-color: black;
}
</style>
