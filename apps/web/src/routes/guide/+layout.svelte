<script lang="ts">
    import "./guide.scss";
    import { page } from "$app/stores";
    import { TextGradient, HoverTextGradient, SpecialBlockquote } from "@discmjs/ui";

    const sections = ["introduction","installation","concepts","command-and-event-handling","commands","events"];

    $: split = $page.url.href.split("/");
    $: section = split[split.length - 1];
    $: index = sections.findIndex(s => s === section);
</script>

<article>
    <h1>
        <TextGradient color1="pink" color2="mediumpurple">
            {@const title = section.replace(/\-/g," ")}
            {title.charAt(0).toUpperCase() + title.slice(1)}
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
                            {@const title = page.replace(/\-/g," ")}
                            {title.charAt(0).toUpperCase() + title.slice(1)}
                        </TextGradient>
                    {:else}
                        <HoverTextGradient color1="pink" color2="mediumpurple">
                            {@const title = page.replace(/\-/g," ")}
                            {title.charAt(0).toUpperCase() + title.slice(1)} 
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
        {@const title = previous.replace(/\-/g," ")}
        <a href="/guide/{previous}">
            <TextGradient color1="pink" color2="mediumpurple">Previous</TextGradient>
            <p>{title.charAt(0).toUpperCase() + title.slice(1)}</p>
        </a>
    {:else}
        <div/>
    {/if}
    {#if index !== (sections.length - 1)}
        {@const next = sections[index + 1]}
        {@const title = next.replace(/\-/g," ")}
        <a href="/guide/{next}">
            <TextGradient color1="pink" color2="mediumpurple">Next</TextGradient>
            <p>{title.charAt(0).toUpperCase() + title.slice(1)}</p>
        </a>
    {:else}
        <div/>
    {/if}
</footer>