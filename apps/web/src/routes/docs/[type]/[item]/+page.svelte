<script lang="ts">
    import type { PageData } from "./$types";
    import { page } from "$app/stores";
    import { DocItem } from "@discmjs/ui";

    const { node, item, type } = $page.data as PageData;
</script>

<DocItem {node} {item} {type}></DocItem>
