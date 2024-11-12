<script lang="ts">
    import { onMount } from "svelte";

    export let identifier: string;
    export let names: string[];
    export let disableCopy = false;

    let copied = false;

    let selectedLang = "";
    let slot: HTMLDivElement;

    onMount(() => {
        selectedLang = document.getElementById(`${identifier}-${names[0]}`).className.replace(/language-(.+)/,"$1").split(" ")[1];

        for(const option of slot?.children){
            if(option.id !== `${identifier}-${names[0]}`) document.getElementById(option.id).style.display = "none";
        }
    });

    function onCopy(){
        navigator.clipboard.writeText(slot?.innerText);

        copied = true;
        setTimeout(() => copied = false, 2000);
    }

    function onOptionButton(name: string){
        for(const option of slot?.children){
            if(option.id === `${identifier}-${name}`){
                selectedLang = document.getElementById(`${identifier}-${name}`).className.replace(/language-(.+)/,"$1").split(" ")[1];
                document.getElementById(`${identifier}-${name}`).style.display = "inline";
                document.getElementById(`button-${identifier}-${name}`).classList.add("selected");
            } else{
                document.getElementById(option.id).style.display = "none";
                document.getElementById(`button-${option.id}`).classList.remove("selected");
            }
        }
    }
</script>

<div>
    <div class="heading">
        <div class="options-container">
            {selectedLang}
            {#each names as name, i (name)}
                <button id="button-{identifier}-{name}" class="option" class:selected={i === 0} on:click={() => onOptionButton(name)}>
                    {name}
                </button>
            {/each}
        </div>
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
    <div class="display" bind:this={slot}>
        <slot/>
    </div>
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

        .option:first-child{
            margin-left: 15px;
        }

        .option:not(:last-child){
            margin-right: 15px;
        }

        button {
            background: #111;
            color: #e7e7e7;
            border: none;
            padding: 10px 15px;
            cursor: pointer;

            &:hover{
                background: #1a1a1a;
            }

            &.selected{
                color: mediumpurple;
            }
        }
    }
</style>