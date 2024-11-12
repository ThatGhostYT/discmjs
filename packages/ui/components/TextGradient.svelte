<script lang="ts">
    export let color1: string;
    export let color2: string;
</script>

<span id="gradient" style="--color1: {color1}; --color2: {color2}">
    <slot>Content not provided.</slot>
</span>

<style>
    #gradient{
        background: linear-gradient(
            var(--color1),
            var(--color2)
        );
        background-clip: text;
        color: transparent;
    }
</style>