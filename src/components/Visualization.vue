<template>
    <div class="viz">
        <canvas id="threeCanvas" ></canvas>
    </div>
</template>

<script>
    import * as THREE from "three";

    export default {
        name: "Visualization",

        methods: {
            init() {
                let canvas = document.getElementById('threeCanvas');
                let renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true});
                console.log(canvas.width);
                renderer.setSize(canvas.width, canvas.height, false);
                this.$three.camera.aspect = canvas.width / canvas.height;
                this.$three.camera.updateProjectionMatrix();
                var material = new THREE.PointsMaterial({
                    size: 5,
                    vertexColors: THREE.VertexColors
                });
                var geometry = new THREE.Geometry();
                var x, y, z;
                for (var i = 0; i < 1000; i++) {
                    x = (Math.random() * 800) - 400;
                    y = (Math.random() * 800) - 400;
                    z = (Math.random() * 800) - 400;

                    geometry.vertices.push(new THREE.Vector3(x, y, z));
                    geometry.colors.push(new THREE.Color(Math.random(), Math.random(), Math.random()));
                    geometry.colors[i] = new THREE.Color(Math.random(), Math.random(), Math.random());

                }
                var pointCloud = new THREE.Points(geometry, material);
                this.$three.scene.add(pointCloud);
                renderer.render(this.$three.scene, this.$three.camera);
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
