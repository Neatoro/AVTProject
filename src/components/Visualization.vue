<template>
  <canvas class="viz" id="threeCanvas" ref="threeCanvas"></canvas>
</template>

<script>
import * as THREE from "three";
import { mapState } from "vuex";
import _ from "lodash";

export default {
  name: "Visualization",
  data: () => ({
    mesh: [],
    frequencyAvg: [],
    SCALEFACTOR: 1,
    SPACEBETWEENCUBES: 200,
      NUMBEROFSEGMENTS: 4
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
      const geometry = new THREE.BoxGeometry(50, 50, 50, this.NUMBEROFSEGMENTS, this.NUMBEROFSEGMENTS, this.NUMBEROFSEGMENTS);
      const material = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        opacity: 1,
          wireframe: true,
      });
      this.mesh[i] = new THREE.Mesh(geometry, material);
         let geo = new THREE.EdgesGeometry(this.mesh[i].geometry);
        let mat = new THREE.LineBasicMaterial({
        color: 0x000000,
        linewidth: 4
      });
      let wireframe = new THREE.LineSegments(geo, mat);
      this.mesh[i].add(wireframe);
      this.mesh[i].position.x = i * this.SPACEBETWEENCUBES - (this.trackCount * (this.SPACEBETWEENCUBES / 2) - (this.SPACEBETWEENCUBES / 2));
      this.mesh[i].position.z = -100;
      this.mesh[i].rotation.x += 0.3;
      this.$three.scene.add(this.mesh[i]);

      //position all existing cubes at correct position
      _.forEach(
        this.mesh,
        _.bind(function(mesh, index) {
          console.log(index);
          mesh.position.x = index * this.SPACEBETWEENCUBES - (this.trackCount * (this.SPACEBETWEENCUBES / 2) - (this.SPACEBETWEENCUBES / 2));
        }, this)
      );

      // this.mesh[i].rand = {
      //   r: Math.random() / 2,
      //   g: Math.random() / 2,
      //   b: Math.random() / 2
      // };
    },
    render() {
      this.$audio.analyser.getByteFrequencyData(this.$audio.dataArray);
      this.frequencyAvg = this.splitAndAvg(this.$audio.dataArray, this.trackCount);
      _.forEach(
        this.tracks,
        _.bind(function(track, index) {
          if (_.isFunction(track.analyser)) {

            // const frequencyAvgPerTrack =
            //   _.reduce(
            //     this.$audio.dataArray,
            //     (avg, current, index) => {
            //       return avg + (current - avg) / (index + 1);
            //     },
            //     0
            //   ) / 255;

            const mesh = this.mesh[index];
            if (this.frequencyAvg[index] === 0) {
              mesh.scale.x = 1;
              mesh.scale.y = 1;
              mesh.scale.z = 1;
            } else {
                mesh.scale.x = this.frequencyAvg[index] * this.SCALEFACTOR + 1;
                mesh.scale.y = this.frequencyAvg[index] * this.SCALEFACTOR + 1;
                mesh.scale.z = this.frequencyAvg[index] * this.SCALEFACTOR + 1;
            }

              track.analyser().getByteFrequencyData(this.$audio.dataArray);
            let frequencyAvgTrack = this.splitAndAvg(this.$audio.dataArray, this.NUMBEROFSEGMENTS * 3);
                for ( var i = 1; i <2; i++ ) {
                    mesh.geometry.vertices[i].x += 1;
                    // mesh.geometry.vertices[i].y += 0.41;
                    mesh.geometry.vertices[i].z += 1.2;
                }
                mesh.geometry.verticesNeedUpdate = true;

            // mesh.material.color.setRGB(
            //   factor * mesh.rand.r,
            //   factor * mesh.rand.g,
            //   factor * mesh.rand.b
            // );
          }
        }, this)
    );

      _.forEach(this.mesh, mesh => {
        mesh.rotation.y += 0.01 * Math.random();
      });

      this.$three.renderer.render(this.$three.scene, this.$three.camera);
      window.requestAnimationFrame(this.render);
    },
    splitAndAvg(dataArray, count) {
      let avgArray = [];
      const size = Math.floor(dataArray.length / count);
      for (let i = 0; i < count; i++) {
        let slice = _.slice(dataArray, i * size, (i + 1) * size);
        let avg = this.calcFrequencyAvg(slice);
        avgArray.push(avg);
      }
      return avgArray;
    },
    calcFrequencyAvg(array) {
      return (
        _.reduce(
          array,
          (avg, current, index) => {
            return avg + (current - avg) / (index + 1);
          },
          0
        ) / 255
      );
    },
    handleResize() {
      this.$three.camera.left = -this.$refs.threeCanvas.clientWidth / 2;
      this.$three.camera.top = this.$refs.threeCanvas.clientHeight / 2;
      this.$three.camera.bottom = -this.$refs.threeCanvas.clientHeight / 2;
      this.$three.camera.right = this.$refs.threeCanvas.clientWidth / 2;

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
  background-color: black;
}
</style>
