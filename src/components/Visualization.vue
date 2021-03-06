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
    SCALEFACTORCUBES: 0.5,
    SPACEBETWEENCUBES: 200,
    //Should not be higher than 80
    NUMBEROFSEGMENTS: 16,
    SCALFACTORSIDES: 40,
    CUBESIZE: 100
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
      const geometry = new THREE.BoxGeometry(
        this.CUBESIZE,
        this.CUBESIZE,
        this.CUBESIZE,
        this.NUMBEROFSEGMENTS,
        this.NUMBEROFSEGMENTS,
        this.NUMBEROFSEGMENTS
      );

      const material = new THREE.MeshNormalMaterial({ wireframe: true });
      this.mesh[i] = new THREE.Mesh(geometry, material);
      this.mesh[i].position.x =
        i * this.SPACEBETWEENCUBES -
        (this.trackCount * (this.SPACEBETWEENCUBES / 2) -
          this.SPACEBETWEENCUBES / 2);
      this.mesh[i].position.z = -100;
      this.mesh[i].rotation.x += 0.3;
      this.$three.scene.add(this.mesh[i]);

      //position all existing cubes at correct position
      _.forEach(
        this.mesh,
        _.bind(function(mesh, index) {
          console.log(index);
          mesh.position.x =
            index * this.SPACEBETWEENCUBES -
            (this.trackCount * (this.SPACEBETWEENCUBES / 2) -
              this.SPACEBETWEENCUBES / 2);
        }, this)
      );

    },
    render() {
      this.$audio.analyser.getByteFrequencyData(this.$audio.dataArray);
      this.frequencyAvg = this.splitAndAvg(
        this.$audio.dataArray,
        this.trackCount
      );
      _.forEach(
        this.tracks,
        _.bind(function(track, index) {
          if (_.isFunction(track.analyser)) {
            const mesh = this.mesh[index];
            if (this.frequencyAvg[index] === 0) {
              mesh.scale.x = 1;
              mesh.scale.y = 1;
              mesh.scale.z = 1;
            } else {
              mesh.scale.x =
                this.frequencyAvg[index] * this.SCALEFACTORCUBES + 1;
              mesh.scale.y =
                this.frequencyAvg[index] * this.SCALEFACTORCUBES + 1;
              mesh.scale.z =
                this.frequencyAvg[index] * this.SCALEFACTORCUBES + 1;
            }

            track.analyser().getByteFrequencyData(this.$audio.dataArray);
            let frequencyAvgTrack = this.splitAndAvg(
              this.$audio.dataArray,
              (this.NUMBEROFSEGMENTS - 1) * 3
            );

            //LBand - left side
            for (
              let i = (this.NUMBEROFSEGMENTS + 1) * (this.NUMBEROFSEGMENTS + 2);
              i < (this.NUMBEROFSEGMENTS + 1) * (2 * this.NUMBEROFSEGMENTS + 1);
              i++
            ) {
              let index =
                Math.floor(i / (this.NUMBEROFSEGMENTS + 1)) -
                this.NUMBEROFSEGMENTS +
                1;
              mesh.geometry.vertices[i].x =
                -(this.CUBESIZE / 2) -
                frequencyAvgTrack[index] * this.SCALFACTORSIDES;
            }

            //MBand - bottom side
            let row = 0;
            //left & right side
            let start =
              2 * (this.NUMBEROFSEGMENTS + 1) * (this.NUMBEROFSEGMENTS + 1) +
              //top side
              (this.NUMBEROFSEGMENTS + 1) * (this.NUMBEROFSEGMENTS - 1) +
              //front side
              (this.NUMBEROFSEGMENTS - 1) * (this.NUMBEROFSEGMENTS - 1);

            for (
              let i = start;
              i <
              start + (this.NUMBEROFSEGMENTS - 1) * (this.NUMBEROFSEGMENTS + 1);
              i++
            ) {
              mesh.geometry.vertices[i].y =
                -(this.CUBESIZE / 2) -
                frequencyAvgTrack[row + this.NUMBEROFSEGMENTS - 1] *
                  this.SCALFACTORSIDES;
              if (row < this.NUMBEROFSEGMENTS - 2) {
                row++;
              } else {
                row = 0;
              }
            }

            //HBand - right side
            for (
              let i = this.NUMBEROFSEGMENTS + 1;
              i < (this.NUMBEROFSEGMENTS + 1) * this.NUMBEROFSEGMENTS;
              i++
            ) {
              let row = Math.floor(i / (this.NUMBEROFSEGMENTS + 1));
              let index = frequencyAvgTrack.length - row;
              mesh.geometry.vertices[i].x =
                this.CUBESIZE / 2 +
                frequencyAvgTrack[index] * this.SCALFACTORSIDES;
            }

            mesh.geometry.verticesNeedUpdate = true;
              
          }
        }, this)
      );

      // _.forEach(this.mesh, mesh => {
      //   mesh.rotation.y += 0.01 * Math.random();
      // });

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
