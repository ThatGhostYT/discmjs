<script lang="ts">
    import "../app.scss";
    import { TextGradient, HoverTextGradient } from "@discmjs/ui";

    let shard: HTMLDivElement;

    function followMouse({ clientX }: HTMLElementEventMap["mousemove"]){
        shard.animate({
            left: `${clientX}px`
        },{ duration: 3000, fill: "forwards" });
    }

    let mobileWidgetExpanded = false;
    let visible = false;

    function hamburgerMenu(){
        mobileWidgetExpanded = !mobileWidgetExpanded;

        if(mobileWidgetExpanded){
            visible = true;
        } else{
            setTimeout(() => visible = false, 1000);
        }
    }
</script>

<svelte:head>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
</svelte:head>
<svelte:body on:mousemove={followMouse}/>

<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<header>
    <a href="/" id="logo">discm<TextGradient color1="pink" color2="mediumpurple">.js</TextGradient></a>
    <nav>
        <div id="shard" bind:this={shard}></div>
        <ul
            id="widget"
            aria-hidden={!mobileWidgetExpanded}
            class:visible
            class:slideIn={mobileWidgetExpanded}
            class:slideOut={!mobileWidgetExpanded}
        >
            {#each ["about","why","benefits"] as id (id)}
                <li>
                    <a href="/#{id}">
                        <HoverTextGradient color1="pink" color2="mediumpurple">{id.charAt(0).toUpperCase() + id.slice(1).toLowerCase()}</HoverTextGradient>
                    </a>
                </li>
            {/each}
        </ul>
        <button id="icon" aria-expanded={mobileWidgetExpanded} aria-controls="widget" on:click={hamburgerMenu}>
            <i class="fa fa-bars"></i>
        </button>
    </nav>
</header>

<main>
    <slot/>
</main>

<style lang="scss">
    @keyframes slideIn{
        from{
            transform: translateX(-100%);
        }

        to{
            transform: translateX(0);
        }
    }

    @keyframes slideOut{
        from{
            transform: translateX(0);
        }

        to{
            transform: translateX(-100%);
        }
    }

    header{
        display: flex;
        padding: 0 5vmax;
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

        #widget{
            display: flex;
            list-style-type: none;
            margin: 0;
            padding-right: 5vmax;
            gap: 5vmax;
        }

        #icon{
            display: none;
            background: transparent;
            border: none;
            color: #e7e7e7;
            cursor: pointer;
        }

        @media(max-width: 600px){
            #icon{
                display: block;
            }

            #widget{
                display: none;
                place-items: center;
                gap: 5vmax;
                position: absolute;
                list-style-type: none;
                background: black;
                padding: 0;
                right: 0;
                top: 6vmax;
                width: 100%;
                height: calc(100vh - 5vmax);
                border-top: 1px solid mediumpurple;

                li{
                    margin: 0;
                    text-align: center;
                    font-size: 2em;

                    a{
                        font-weight: bold;
                    }
                }

                &.visible{
                    display: grid;
                }

                &.slideIn{
                    animation: slideIn .5s linear forwards;
                }

                &.slideOut{
                    animation: slideOut .5s linear forwards;
                }
            }
        }
    }
</style>