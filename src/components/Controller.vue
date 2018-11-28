<template>
    <div class="controller">
        <button class="switch" @click="onPlayPause">{{ getPlayPauseLabel() }}</button>
        <Slider title="Volume" :min="0" :max="100" :defaultValue="100" @change="onMasterVolumeChanged"></Slider>
        <Slider title="BPM" :min="80" :max="200" :defaultValue="80" @change="onBPMChanged"></Slider>
    </div>
</template>

<script>
    import {mapState} from "vuex";
    import {actionTypes, mutationTypes} from "@/store";
    import Slider from "@/components/Slider.vue";

    function tick() {
        this.$store.dispatch(actionTypes.NEXT_COLUMN);
    }

    function start() {
        const timing = 60000 / (this.bpm * 4);
        console.log(timing);
        this.interval = setInterval(tick.bind(this), timing);
    }

    function stop() {
        clearInterval(this.interval);
        this.interval = undefined;
    }

    export default {
        name: "Controller",
        components: {
            Slider
        },
        data: () => ({
            interval: undefined
        }),
        computed: mapState({
            isPlaying: state => state.isPlaying,
            bpm: state => state.bpm
        }),
        watch: {
            isPlaying() {
                if (this.isPlaying) {
                    start.bind(this)();
                } else {
                    stop.bind(this)();
                }
            }
        },
        methods: {
            getPlayPauseLabel() {
                return this.isPlaying ? "Pause" : "Play";
            },
            onPlayPause(evt) {
                evt.preventDefault();
                this.$store.commit(mutationTypes.SET_IS_PLAYING, !this.isPlaying);
            },
            onBPMChanged(bpm) {
                this.$store.commit(mutationTypes.SET_BPM, bpm);
            },
            onMasterVolumeChanged(volume) {
                this.$audio.gain.gain.value = volume / 100;
            }
        }
    };
</script>

<style lang="scss">
    .controller {
        display: flex;
    }
</style>
