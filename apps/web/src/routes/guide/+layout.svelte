<script lang="ts">
    import "./guide.scss";
    import { page } from "$app/stores";
    import { TextGradient, HoverTextGradient, SpecialBlockquote } from "@discmjs/ui";

    const sections = ["introduction","prerequisites","installation","concepts","command-and-event-handling","text-commands","slash-commands","command-overloading","deployment","events"];

    function formatTitle(title: string){
        return title.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
    }

    $: split = $page.url.href.split("/");
    $: section = split[split.length - 1];
    $: index = sections.findIndex(s => s === section);
    $: title = formatTitle(section);
</script>

<svelte:head>
    <meta property="og:title" content="discm.js Guide" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="discm.js.org/guide" />
    <meta property="og:image" content="favicon.png" />
    <meta
        property="og:description"
        content="Discm.js is a framework built on typescript and discord.js to make creating discord bots easier."
    />
    <meta name="theme-color" content="#9370DB" />
</svelte:head>

<article>
    <h1>
        <TextGradient color1="pink" color2="mediumpurple">
            {title}
        </TextGradient>
    </h1>
    
    <SpecialBlockquote type="warning">
        This page is still a work in progress.
    </SpecialBlockquote>

    <slot/>
</article>

<nav class="guide-nav">
    <ul>
        {#each sections as page (page)}
            <li>
                <a class="nav-link" href="/guide/{page}">
                    {#if page === section}
                        <TextGradient color1="pink" color2="mediumpurple">
                            {title}
                        </TextGradient>
                    {:else}
                        <HoverTextGradient color1="pink" color2="mediumpurple">
                            {formatTitle(page)} 
                        </HoverTextGradient>
                    {/if}
                </a>
            </li>
        {/each}
    </ul>
</nav>

<footer>
    {#if index !== 0}
        {@const previous = sections[index - 1]}
        <a href="/guide/{previous}">
            <TextGradient color1="pink" color2="mediumpurple">Previous</TextGradient>
            <p>{formatTitle(previous)}</p>
        </a>
    {:else}
        <div/>
    {/if}
    {#if index !== (sections.length - 1)}
        {@const next = sections[index + 1]}
        <a href="/guide/{next}">
            <TextGradient color1="pink" color2="mediumpurple">Next</TextGradient>
            <p>{formatTitle(next)}</p>
        </a>
    {:else}
        <div/>
    {/if}
</footer>