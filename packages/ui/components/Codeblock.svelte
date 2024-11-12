<script lang="ts">
    export let language: string;
    export let disableCopy = false;

    let copied = false;

    let slot: HTMLDivElement;

    function onCopy(){
        navigator.clipboard.writeText(slot?.innerText);

        copied = true;
        setTimeout(() => copied = false, 2000);
    }
</script>

<div>
    <div style="display: none;" bind:this={slot}><slot/></div>
    <div class="heading">
        {language}
        {#if !disableCopy}
            <button class="copy" on:click={onCopy}>
                {#if copied}
                    Copied!
                {:else}
                    Copy
                {/if}
            </button>
        {/if}
    </div>
    <pre class="code language-{language}"><code>{slot?.innerText}</code></pre>
</div>

<style lang="scss">
    .heading{
        background-color: #222;
        padding: 15px;
        border-radius: 15px 15px 0 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;

        button.copy {
            background: #111;
            color: #e7e7e7;
            border: none;
            padding: 10px 15px;
            cursor: pointer;

            &:hover{
                background: #1a1a1a;
            }
        }
    }

    pre.code {
        display: inline;
        text-wrap: wrap;

        code{
            display: block;
            background-color: #333;
            padding: 15px;
            border-radius: 0 0 15px 15px;
            width: 100%;
        }
    }
</style>