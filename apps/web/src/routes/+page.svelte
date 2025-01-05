<script lang="ts">
    import { TextGradient, Card } from "@discmjs/ui";
    
    const sections = [
        {
            title: "What is discm.js?",
            id: "about",
            description: "Discm is a framework for creating discord bots. It is built on top of and compatible with discord.js. Designed to be easy to use and to create discord bots fast.",
            img: "Saly-1.png"
        },
        {
            title: "Why should I use discm.js?",
            id: "why",
            description: "Discm is well documented, fast, modular, and easy to use. These will boost your production speed, helping you build your dream bot sooner.",
            img: "Saly-42.png"
        },
        {
            title: "Benefits to using discm.js.",
            id: "benefits",
            description: "As previously stated, its speed, modular architect, and documentation all improve developer experience. Its well written and concise guide also helps the developer to understand complex concepts in a matter of minutes.",
            img: "Saly-26.png"
        }
    ];
</script>

<svelte:head>
    <meta property="og:title" content="discm.js" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="discm.js.org" />
    <meta property="og:image" content="favicon.png" />
    <meta
        property="og:description"
        content="Discm.js is a framework built on typescript and discord.js to make creating discord bots easier."
    />
    <meta name="theme-color" content="#9370DB" />
</svelte:head>

<h1 id="title">
    discm<TextGradient color1="pink" color2="mediumpurple">.js</TextGradient>
</h1>

<ul id="sections">
    {#each sections as section (section.id)}
        <li class="section" id="{section.id}">
            <section>
                <Card src="{section.img}" alt="{section.img}" title="{section.title}">
                    {section.description}
                </Card>
            </section>
        </li>
    {/each}
</ul>

<style lang="scss">
    #title{
        @media (min-width: 768px) {
            font-size: 3em;
            line-height: 150%;
        }

        @media (min-width: 1200px) {
            font-size: 5em;
            line-height: 100%;
        }
    }

    #sections{
        list-style-type: none;
        padding: 0;
        margin: 0;
        display: inline;

        li.section{
            &:not(:last-child){
                margin-bottom: 5vmax;
            }
        }
    }
</style>