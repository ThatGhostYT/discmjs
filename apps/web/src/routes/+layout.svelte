<script lang="ts">
    import "../app.scss";
    import { TextGradient } from "@discmjs/ui";

    let shard: HTMLDivElement;
    let hovered = false;
    function followMouse({ clientX }: HTMLElementEventMap["mousemove"]){
        shard.animate({
            left: `${clientX}px`
        },{ duration: 3000, fill: "forwards" });
    }
</script>

<svelte:body on:mousemove={followMouse}/>

<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<header on:mouseover={() => hovered = true} on:mouseleave={() => hovered = false}>
    <p id="logo">discm<TextGradient color1="pink" color2="mediumpurple">.js</TextGradient></p>
    <nav>
        <div id="shard" class:visible={!hovered} bind:this={shard}></div>
        <ul>
            {#each Array.from({ length: 5 }) as _,i (i)}
                <li>{++i}</li>
            {/each}
        </ul>
    </nav>
</header>

<main>
    <slot/>
</main>

<style lang="scss">
    header{
        display: flex;
        backdrop-filter: blur(6px);
        position: fixed;
        top: 0;
        width: 100%;
        height: 6vmax;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid #555;
        transition: 250ms;

        #logo{
            padding-left: 6vmax;
            font-weight: bold;

            @media (min-width: 768px) {
                font-size: 1.5em;
                line-height: 150%;
            }

            @media (min-width: 1200px) {
                font-size: 2em;
                line-height: 100%;
            }
        }

        &:hover{
            border: 10px solid;
            border-image: linear-gradient(
                to right,
                pink,
                mediumpurple
            ) 1;
        }

        #shard.visible{
            width: 280px;
            height: 1px;
            position:absolute;
            background: linear-gradient(
                to right,
                transparent,
                mediumpurple,
                transparent
            );
            top: calc(6vmax - 1px);
            translate: -50% -50%;
        }

        ul{
            display: flex;
            list-style-type: none;
            margin: 0;
            padding-right: 5vmax;
            gap: 5vmax;
        }
    }
</style>