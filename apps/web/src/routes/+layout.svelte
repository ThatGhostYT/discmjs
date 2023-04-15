<script lang="ts">
    import "../app.scss";
    import { TextGradient, HoverTextGradient } from "@discmjs/ui";
    import { page } from "$app/stores";

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
            {#if $page.route.id === "/"}
                {#each ["about","why","benefits"] as id (id)}
                    <li>
                        <a href="/#{id}">
                            <HoverTextGradient color1="pink" color2="mediumpurple">{id.charAt(0).toUpperCase() + id.slice(1).toLowerCase()}</HoverTextGradient>
                        </a>
                    </li>
                {/each}
            {:else}
                {#each Array.from({ length: 5}) as _,i}
                    <li>{++i}</li>
                {/each}
            {/if}
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

        @media(min-width: 700px){
            backdrop-filter: blur(0px);
            background: black;

            &:hover{
                border: 0.5vmax solid;
                border-image: linear-gradient(
                    to right,
                    pink,
                    mediumpurple
                ) 1;
            }
    
            #shard.visible{
                width: 32vmax;
                height: 2px;
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