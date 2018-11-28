<template>
    <div class="viz">
        <canvas id="threeCanvas"></canvas>
    </div>
</template>

<script>
    import * as THREE from "three";

    export default {
        name: "Visualization",

        methods: {
            init() {
                let canvas = document.getElementById('threeCanvas');
                this.$three.renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true});
                console.log(canvas.width);
                this.$three.renderer.setSize(canvas.width, canvas.height, false);
                this.$three.camera.aspect = canvas.width / canvas.height;
                this.$three.camera.updateProjectionMatrix();
                var material = new THREE.PointsMaterial({
                    size: 5,
                    vertexColors: THREE.VertexColors
                });

                let x, y, z;
                for (let i = 0; i < 1000; i++) {
                    x = (Math.random() * 800) - 400;
                    y = (Math.random() * 800) - 400;
                    z = (Math.random() * 800) - 400;

                    this.$three.geometry.vertices.push(new THREE.Vector3(x, y, z));
                    this.$three.geometry.colors.push(new THREE.Color(Math.random(), Math.random(), Math.random()));
                    this.$three.geometry.colors[i] = new THREE.Color(Math.random(), Math.random(), Math.random());
                }
                let pointCloud = new THREE.Points(this.$three.geometry, material);
                this.$three.scene.add(pointCloud);
                this.$three.renderer.render(this.$three.scene, this.$three.camera);
                this.render.bind(this)();
            },
            render() {
                window.requestAnimationFrame(this.render);
                this.$audio.analyser.getByteFrequencyData(this.$audio.dataArray);
                this.$three.geometry.vertices.forEach(function (particle, index) {
                    this.$three.geometry.colors[index] = new THREE.Color(this.$audio.dataArray[0] / 255, this.$audio.dataArray[20] / 255, this.$audio.dataArray[80] / 255)
                }.bind(this));
                this.$three.geometry.verticesNeedUpdate = true;
                this.$three.geometry.colorsNeedUpdate = true;

                this.$three.renderer.render(this.$three.scene, this.$three.camera);
            }
        },
        mounted() {
            this.init();
        }
    };
</script>

<style lang="scss">
    .viz {
        height: 25vh;
        background-color: #333;
    }

    #threeCanvas {
        width: inherit;
        height: inherit;
    }
</style>
