<template>
    <div class="home">
        <Slider title="Volume" :min="0" :max="100"></Slider>
        <Slider title="Lowpass" :min="0" :max="18000"></Slider>
        <Slider title="Highpass" :min="0" :max="18000" :defaultValue="10"></Slider>
        <Sequencer>
            <Step></Step>
        </Sequencer>
    </div>
</template>

<script>
    // @ is an alias to /src

    import Slider from '@/components/Slider.vue';
    import Sequencer from "@/components/Sequencer.vue";

    export default {
        name: "home",
        components: {
            Sequencer,
            Slider
        }
    };
</script>
