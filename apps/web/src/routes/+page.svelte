<script>
    import { TextGradient } from "@discmjs/ui";

    const description = "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Vero deserunt voluptate aperiam tenetur rerum, voluptatum laborum eveniet nihil, molestias voluptatem quam ex hic repellat est natus. Optio, voluptates consectetur unde laborum harum, iure corporis, numquam consequuntur dolorum repudiandae nesciunt. Non quia distinctio voluptates nihil, tempora numquam sequi fugit quasi incidunt fuga iste pariatur quidem soluta doloremque a obcaecati expedita neque quam perferendis. Fugiat corrupti sunt autem excepturi exercitationem totam laudantium velit at hic sapiente praesentium, facere quos rem, dolore, necessitatibus vitae. Porro commodi, sunt esse nemo maxime, exercitationem veniam, perspiciatis quisquam fuga repellat doloribus. Illum blanditiis tempore necessitatibus ea consequuntur.";
    const sections = [
        {
            title: "What is discm.js?",
        },
        {
            title: "Why should I use discm?",
        },
        {
            title: "Benefits to using discm.js.",
        }
    ];
</script>

<h1 id="title">
    discm<TextGradient color1="pink" color2="mediumpurple">.js</TextGradient>
</h1>

{#each sections as section (section.title)}
    <section>
        <h2>
            <TextGradient color1="pink" color2="mediumpurple">{section.title}</TextGradient>
        </h2>
        <p>{description}</p>
    </section>
{/each}

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
</style>