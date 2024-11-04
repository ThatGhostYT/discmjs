<script lang="ts">
    export let name: string;
    export let language: string;
    export let identifier: string;
</script>

<pre id="{identifier}-{name}" class="code language-{language}"><code><slot/></code></pre>

<style lang="scss">
    pre.code {
        display: inline;
        text-wrap: wrap;

        code{
            display: block;
            background-color: #333;
            padding: 15px;
            border-radius: 0 0 15px 15px;
            width: 100%;
            text-overflow: ellipsis;
        }
    }
</style>