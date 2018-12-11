<template>
        <canvas id="threeCanvas" ref="threeCanvas"></canvas>
</template>

<script>
import * as THREE from "three";

export default {
  name: "Visualization",
  data: () => ({
    mesh: null
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
      let material = new THREE.MeshPhongMaterial({
        color: 0xfefefe,
        opacity: 0.5
      });
      this.mesh = new THREE.Mesh(geometry, material);
      let geo = new THREE.EdgesGeometry(this.mesh.geometry);
      let mat = new THREE.LineBasicMaterial({
        color: 0xffffff,
        linewidth: 4
      });
      let wireframe = new THREE.LineSegments(geo, mat);

      this.mesh.add(wireframe);
      this.$three.scene.add(this.mesh);
      this.mesh.position.z = -100;
      console.log(this.mesh.position.z);
      this.$three.renderer.render(this.$three.scene, this.$three.camera);
      this.render.bind(this)();
    },
    render() {
      this.$audio.analyser.getByteFrequencyData(this.$audio.dataArray);
      /*this.wireframe.color = new THREE.Color(
          this.$audio.dataArray[0] / 255,
          this.$audio.dataArray[20] / 255,
          this.$audio.dataArray[80] / 255
        );*/
      this.mesh.rotation.x += 0.01;
      this.mesh.rotation.z += 0.01;
      this.$three.renderer.render(this.$three.scene, this.$three.camera);
      window.requestAnimationFrame(this.render);
    },
    handleResize() {
      //this.$refs.threeCanvas.width = window.innerWidth;
      this.$three.renderer.setSize(
        this.$refs.threeCanvas.clientWidth,
        this.$refs.threeCanvas.clientHeight,
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
  width: 100vw;
  height: 25vh;
  background-color: black;
}
</style>
