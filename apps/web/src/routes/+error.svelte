<script lang="ts">
    import { page } from "$app/stores";
    import { TextGradient } from "@discmjs/ui";
</script>

<h1 id="title">
    <TextGradient color1="pink" color2="mediumpurple">{$page.status}</TextGradient>: {$page.error?.message}
</h1>

<p>
    Something went wrong, please try again later.
</p>

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