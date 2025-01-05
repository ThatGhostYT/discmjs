<script lang="ts">
    import TextGradient from "./TextGradient.svelte";

    export let title: string;
    export let src: string;
    export let alt = "card";

    const borderRadius = src ? "0 15px 15px 0" : "15px";
</script>

<div class="container">
    {#if src}
        <div class="img">
            <img {src} {alt}>
        </div>
    {/if}
    <div class="card" style="--border-radius: {borderRadius}">
        <h2>
            <TextGradient color1="pink" color2="mediumpurple">{title}</TextGradient>
        </h2>
        <slot/>
    </div>
</div>

<style lang="scss">
    .container{
        display: flex;

        .card{
            padding: 15px;
            background: #151515;
            width: 100%;
            border-radius: var(--border-radius);
        }

        .img{
            padding: 15px;
            border-radius: 15px 0 0 10px;
            background: linear-gradient(
                to bottom right,
                rgba(147,112,216,50%),
                rgba(255,192,203,50%)
            );
            width: 50%;
            aspect-ratio: 1/1;

            img{
                width: 100%;
                height: 100%;
            }
        }
    }
</style>