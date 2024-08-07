<script lang="ts">
    import { TextGradient } from "@discmjs/ui";
    
    const sections = [
        {
            title: "What is discm.js?",
            id: "about",
            description: [
                "Discm.js is a framework designed to simplify the process of creating Discord bots. It is built on top of the popular discord.js library and provides a streamlined interface for building powerful bots.",
                "With Discm.js, developers can easily create custom commands and events that respond to user interactions in Discord servers.",
                "The framework includes features such as command parsing, message filtering, and error handling, making it a comprehensive solution for creating robust Discord bots.",
                "Its modular architecture also allows developers to easily extend and customize the functionality of their bots. Discm.js is a great choice for anyone looking to create a Discord bot quickly and efficiently."
            ]
        },
        {
            title: "Why should I use discm.js?",
            id: "why",
            description: [
                "Discm.js is a powerful framework for creating Discord bots, built on the popular discord.js library. It leverages the filesystem to handle commands, providing an easy-to-use interface for bot creation.",
                "With Discm.js, developers can quickly and easily create custom commands and events that respond to user interactions in Discord servers.",
                "The framework includes features such as message filtering, error handling, and command parsing, making it a comprehensive solution for building powerful bots. Its modular architecture also allows developers to easily extend and customize the functionality of their bots.",
                "Overall, Discm.js is a great choice for anyone looking to create a Discord bot using the filesystem command handling approach."
            ]
        },
        {
            title: "Benefits to using discm.js.",
            id: "benefits",
            description: [
                "Firstly, its filesystem command handling approach is more intuitive and simpler to use compared to other approaches such as object-oriented command handling. This can make the development process faster and more efficient.",
                "Secondly, Discm.js includes a modular architecture that allows developers to easily customize and extend the functionality of their bots.",
                "Thirdly, it has a built-in message filtering system that can help improve the accuracy of command execution, reducing errors and improving the overall user experience.",
                "Lastly, Discm.js has a well-documented API, making it easier for developers to get started and troubleshoot issues.",
                "In addition to these benefits, Discm.js has a large and active community of contributors who are constantly looking for and fixing vulnerabilities. This means that using Discm.js can provide a higher level of security compared to other frameworks, as the community works tirelessly to identify and patch any potential security risks.",
                "This active community also means that developers can benefit from ongoing updates and improvements to the framework, ensuring that their bots remain up-to-date and functional.",
                "With its intuitive command handling approach, modular architecture, built-in message filtering, and active community of contributors, Discm.js is a top choice for building powerful and secure Discord bots.",
                "Overall, these benefits make Discm.js a strong choice for building Discord bots."
            ]
        }
    ];
</script>

<svelte:head>
    <meta property="og:title" content="discm.js" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="discm.js.org" />
    <meta property="og:image" content="%sveltekit.assets%/favicon.png" />
    <meta
        property="og:description"
        content="Discm.js is a framework built on typescript and discord.js to make creating discord bots easier."
    />
    <meta name="theme-color" content="#9370DB" />
</svelte:head>

<div id="about"></div>
<h1 id="title">
    discm<TextGradient color1="pink" color2="mediumpurple">.js</TextGradient>
</h1>

<ul id="sections">
    {#each sections as section, i (section.id)}
        <li id="section">
            <section>
                <h2>
                    <TextGradient color1="pink" color2="mediumpurple">{section.title}</TextGradient>
                </h2>
                <ul class="content">
                    {#each section.description as item}
                        <li>{item}</li>
                    {/each}
                </ul>
            </section>
            {#if i !== sections.length - 1}
                <div id={sections[++i].id}></div>
            {/if}
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

        li#section:not(:last-child){
            margin-bottom: 10vmax;
        }
    }

    ul.content > li:not(:last-child){
        margin-bottom: 15px;
    }
</style>