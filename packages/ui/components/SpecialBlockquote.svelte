<script lang="ts">
    import { default as TextGradient } from "./TextGradient.svelte";

    type Types = "note" | "warning" | "tip";
    type Colors = {
        [P in Types]: {
            color1: string;
            color2: string;
            icon: string;
        }
    }

    export let type: Types = "note";

    const colors: Colors = {
        note: {
            color1: "pink",
            color2: "mediumpurple",
            icon: "fa-circle-info"
        },
        warning: {
            color1: "yellow",
            color2: "darkorange",
            icon: "fa-triangle-exclamation"
        },
        tip: {
            color1: "lightgreen",
            color2: "darkgreen",
            icon: "fa-lightbulb"
        }
    }
</script>

<div>
    <blockquote style="--color1: {colors[type].color1}; --color2: {colors[type].color2}">
        <div class="side"></div>
        <div class="heading">
            <i class="fa-solid {colors[type].icon}" style="color: {colors[type].color1};"></i>
            <TextGradient color1={colors[type].color1} color2={colors[type].color2}>
                {type.slice(0,1).toUpperCase() + type.slice(1).toLowerCase()}
            </TextGradient>
        </div>
        <p class="slot"><slot/></p>
    </blockquote>
</div>

<style lang="scss">
    blockquote{
        position: relative;
        background-color: #222;
        padding: 15px 5px;
        border-radius: 0 5px 5px 0;

        .heading{
            font-weight: bold;
            margin-left: 15px;
        }

        .slot{
            margin-left: 15px;
        }
    }

    .side{
        height: 100%;
        width: 2px;
        position: absolute;
        left: 0;
        top: 0;
        border-radius: 5px 0 0 5px;
        background: linear-gradient(var(--color1),var(--color2));
    }
</style>