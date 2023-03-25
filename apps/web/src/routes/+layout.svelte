<script>
    import "../app.scss";
    import { TextGradient } from "@discmjs/ui";
</script>

<header>
    <p id="logo">discm<TextGradient color1="pink" color2="mediumpurple">.js</TextGradient></p>
    <nav>
        <ul>
            <li>Docs</li>
            <li>Guide</li>
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
        border-bottom: 1px solid #333;

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