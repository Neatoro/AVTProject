<template>
  <canvas id="threeCanvas" ref="threeCanvas"></canvas>
</template>

<script>
import * as THREE from "three";
import { mapState } from "vuex";
import _ from "lodash";

export default {
  name: "Visualization",
  data: () => ({
    mesh: [],
    array: Uint8Array
  }),
  computed: mapState({
    trackCount: state => state.trackCount,
    tracks: state => state.tracks
  }),
  watch: {
    trackCount() {
      this.addCube(this.trackCount - 1);
    }
  },

  methods: {
    init() {
      window.addEventListener("resize", this.handleResize.bind(this));
      this.$three.renderer = new THREE.WebGLRenderer({
        canvas: this.$refs.threeCanvas,
        antialias: true
      });
      this.handleResize();
      for (let i = 0; i < this.trackCount; i++) {
        this.addCube(i);
      }
      this.$three.renderer.render(this.$three.scene, this.$three.camera);
      this.render.bind(this)();
    },
    addCube(i) {
      let geometry = new THREE.BoxGeometry(50, 50, 50);
      let material = new THREE.MeshPhongMaterial({
        color: 0xfefefe,
        opacity: 0.5
      });
      this.mesh[i] = new THREE.Mesh(geometry, material);
      let geo = new THREE.EdgesGeometry(this.mesh[i].geometry);
      let mat = new THREE.LineBasicMaterial({
        color: 0xffffff,
        linewidth: 4
      });
      let wireframe = new THREE.LineSegments(geo, mat);
      this.mesh[i].add(wireframe);
      this.mesh[i].position.x = i * 100 - 300;
      this.$three.scene.add(this.mesh[i]);
      this.mesh[i].position.z = -100;
    },
    render() {

      _.forEach(
        this.tracks,
        function(track) {
            let analyser  = track.analyser();
            const dataArray = new Uint8Array(analyser.fftSize);
          analyser.getByteFrequencyData(dataArray);
          console.log(dataArray);
        }.bind(this)
      );

      this.$audio.analyser.getByteFrequencyData(this.$audio.dataArray);
      /*this.wireframe.color = new THREE.Color(
          this.$audio.dataArray[0] / 255,
          this.$audio.dataArray[20] / 255,
          this.$audio.dataArray[80] / 255
        );*/
      _.forEach(this.mesh, function(mesh) {
        mesh.rotation.x += 0.01;
        mesh.rotation.z += 0.01;
      });

      this.$three.renderer.render(this.$three.scene, this.$three.camera);
      window.requestAnimationFrame(this.render);
    },
    handleResize() {
      console.log(this.$refs.threeCanvas.clientWidth);

      this.$three.camera.left = -this.$refs.threeCanvas.clientWidth / 2;
      this.$three.camera.top = this.$refs.threeCanvas.clientHeight / 2;
      this.$three.camera.bottom = -this.$refs.threeCanvas.clientHeight / 2;
      this.$three.camera.right = this.$refs.threeCanvas.clientWidth / 2;
      // this.$refs.threeCanvas.clientHeight;
      this.$three.renderer.setSize(
        this.$refs.threeCanvas.clientWidth,
        this.$refs.threeCanvas.clientHeight,
        false
      );
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
