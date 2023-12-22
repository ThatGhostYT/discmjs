<script lang="ts">
    import "../app.scss";
    import { TextGradient, HoverTextGradient } from "@discmjs/ui";
    import { page } from "$app/stores";

    let shard: HTMLDivElement;
    let hovered = false;

    function followMouse({ clientX }: HTMLElementEventMap["mousemove"]){
        if(!hovered) shard.animate({
            left: `${clientX}px`
        },{ duration: 3000, fill: "forwards" });
    }
</script>

<svelte:body on:mousemove={followMouse}/>

<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<header on:mouseover={() => hovered = true} on:mouseleave={() => hovered = false}>
    <a href="/" id="logo">discm<TextGradient color1="pink" color2="mediumpurple">.js</TextGradient></a>
    <nav>
        <div id="shard" bind:this={shard}></div>
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
                    <li><HoverTextGradient color1="pink" color2="mediumpurple">{++i}</HoverTextGradient></li>
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
        background: black;
        position: fixed;
        top: 0;
        width: 100%;
        height: 6vmax;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid #555;

        @supports (backdrop-filter: none){
            background: transparent;
            backdrop-filter: blur(6px);
        }

        @media(min-width: 700px){
            #shard{
                width: 32vmax;
                height: 2px;
                position:absolute;
                background: linear-gradient(
                    to right,
                    transparent,
                    mediumpurple,
                    transparent
                );
                top: 6vmax;
                translate: -50% -50%;
            }
        }

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

        ul{
            display: flex;
            list-style-type: none;
            margin: 0;
            padding-right: 5vmax;
            gap: 5vmax;
        }
    }
</style>