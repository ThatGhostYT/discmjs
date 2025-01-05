<script lang="ts">
    import TextGradient from "./TextGradient.svelte";
    import CodeBlock from "./Codeblock.svelte";
    import SpecialBlockquote from "./SpecialBlockquote.svelte";
    import type { FetchNodeSuccess } from "@discmjs/docgen";

    export let node: FetchNodeSuccess;
    export let item: string;
    export let type: string;

    const KindsToReadable = {
        2097152: "type",
        256: "interface",
        128: "class",
        64: "function"
    }

    function githubLinkFromSource(source: any){
        const path = source.fileName.split("/");
        const file = path[path.length - 1];
        return `https://github.com/ThatGhostYT/discmjs/blob/master/packages/discmjs/src/lib/${type}/${file}#L${source.line}`
    }

    function discordJSLinkFromInherited(kind: string, inheritedFrom: any){
        const [item, member] = inheritedFrom.name.split(".");
        return `https://discord.js.org/docs/packages/discord.js/main/${item}:${kind}#${member}`;
    }

    function parseSummary(child: any){
        let summary = "";

        for(const comment of child.comment.summary){
            if(comment.kind === "text"){
                summary += comment.text;
                continue;
            } else if(comment.kind === "inline-tag" && comment.tag === "@link"){
                summary += comment.text;
            }
        }

        return summary;
    }

    function parseType(ctype: any){
        switch(ctype.type){
            case "union": {
                let unions: string[] = [];
                for(const union of ctype.types){
                    unions.push(parseType(union));
                }

                return unions.join(" | ");
            }

            case "intrinsic": {
                return ctype.name;
            }

            case "reflection": {
                let reflection = "{\n";

                if(!ctype.declaration.children) return "any";
                for(const property of ctype.declaration.children){
                    reflection += `\t${property.name}: ${parseType(property.type)};\n`;
                }

                return reflection + "}";
            }

            case "literal": {
                return `'${ctype.value}'`;
            }

            case "reference": {
                if(ctype.typeArguments){
                    const typeArguments: string[] = [];

                    for(const typeArgument of ctype.typeArguments){
                        typeArguments.push(parseType(typeArgument));
                    }

                    return `${ctype.name}<${typeArguments.join(", ")}>`
                } else return ctype.name
            }

            case "typeOperator": {
                return `${ctype.operator} ${parseType(ctype.target)}`
            }

            case "intersection": {
                let intersections: string[] = [];
                for(const intersection of ctype.types){
                    intersections.push(parseType(intersection));
                }

                return intersections.join(" & ");
            }

            case "conditional": {
                return `${parseType(ctype.checkType)} extends ${parseType(ctype.extendsType)} ? ${parseType(ctype.trueType)} : ${parseType(ctype.falseType)}`
            }

            case "array": {
                return `${parseType(ctype.elementType)}[]`;
            }
        }
    }

    function codeblockForKind(child: any){
        switch(KindsToReadable[child.kind]){
            case "type": {
                return `type ${child.name} = ${parseType(child.type)}`;
            }

            case "interface": {
                let typeParam = "";
                if(child.typeParameters){
                    typeParam += "<"
                    for(const param of child.typeParameters){
                        typeParam += `${param.name} extends ${parseType(param.type)}`
                    }
                    typeParam += ">"
                }
                return `interface ${child.name}${typeParam}`;
            }

            case "class": {
                if(child.children[0].signatures[0].parameters){
                    return `new ${child.name}(${child.children[0].signatures[0].parameters.map(p => p.name).join(", ")})`;
                } else {
                    return `new ${child.name}()`;
                }
            }

            case "function": {
                return `function ${child.name}(${child.signatures[0].parameters.map(p => `${p.name}: ${parseType(p.type)}`).join(", ")})`
            }
        }
    }

    // function bodyForKind(child: any): string {
    //     switch(KindsToReadable[child.kind]){
    //         case "type": {
    //             return "";
    //         }

    //         case "interface": {
    //             let table = "<table><tr><th>Property</th><th>Description</th><th>Optional</th><th>Type</th><th>Source</th></tr>";

    //             for(const property of child.children){
    //                 table += `<tr><td>${property.name}</td><td>${parseSummary(property)}</td><td>${property.flags.isOptional ? "✅" : "❌"}</td><td>${parseType(property.type)}</td><td><a class="visible-link" href="${githubLinkFromSource(property.sources[0])}" target="_blank">${property.sources[0].fileName}#L${property.sources[0].line}</a></td></tr>`
    //             }

    //             return table + "</table>"
    //         }

    //         case "class": {
    //             let table = "<table><tr><th>Parameter</th><th>Type</th><th>Optional</th>";

    //             if(!child.children[0].signatures[0].parameters) return "";
    //             for(const parameter of child.children[0].signatures[0].parameters){
    //                 table += `<tr><td>${parameter.name}</td><td>${parseType(parameter.type)}</td><td>${parameter.flags.isOptional ? "✅" : "❌"}</td></tr>`
    //             }

    //             return table + "</table>"
    //         }

    //         case "function": {
    //             let table = "<table><thead><tr><th>Parameter</th><th>Type</th><th>Optional</th></thead><tbody>";

    //             for(const parameter of child.signatures[0].parameters){
    //                 table += `<tr><td>${parameter.name}</td><td>${parseType(parameter.type)}</td><td>${parameter.flags.isOptional ? "✅" : "❌"}</td></tr>`
    //             }

    //             return table + "</tbody></table>"
    //         }
    //     }
    // }
</script>

{#each node.body.children as child}
    {#if item === child.name}
        <div class="header">
            <h1>
                <TextGradient color1="pink" color2="mediumpurple">{KindsToReadable[child.kind] || child.kind}</TextGradient>
                {child.name}
            </h1>
            <p>
                {#if child.extendedTypes}
                    <TextGradient color1="pink" color2="mediumpurple">extends</TextGradient>
                    {parseType(child.extendedTypes[0])}
                {/if}
                {#if child.implementedTypes}
                    <TextGradient color1="pink" color2="mediumpurple">implements</TextGradient>
                    {parseType(child.implementedTypes[0])}
                {/if}
            </p>
            <a class="source-link" href={githubLinkFromSource(child.sources[0])} target="_blank">
                <i class="fa-solid fa-file"></i>
            </a>
        </div>
        <SpecialBlockquote type="warning">
            This page is still a work in progress.
        </SpecialBlockquote>
        <CodeBlock language="typescript" disableCopy>
            {codeblockForKind(child)}
        </CodeBlock>
        <p>{parseSummary(child)}</p>
        {#if KindsToReadable[child.kind] === "class"}
            {#if child.children[0].signatures[0].parameters}
                <table>
                    <thead>
                        <tr>
                            <th>Parameter</th>
                            <th>Type</th>
                            <th>Optional</th>
                        </tr>
                    </thead>
                    <tbody>
                        {#each child.children[0].signatures[0].parameters as parameter}
                            <tr>
                                <td>{parameter.name}</td>
                                <td>{parseType(parameter.type)}</td>
                                <td>{parameter.flags.isOptional ? "✅" : "❌"}</td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            {/if}
            <ul class="class-members">
                {#each child.children as member}
                    {#if !(member.name === "constructor")}
                        <li id={member.name}>
                            <p>
                                <a href="#{member.name}" class="visible-hover">{member.name}</a>
                                {#if !member.flags.isInherited && member.type}
                                    <TextGradient color1="pink" color2="mediumpurple">: {parseType(member.type)}</TextGradient>
                                {/if}
                            </p>
                            {#if member.comment && member.comment.summary}
                                <p>
                                    {parseSummary(member)}
                                </p>
                            {/if}
                            {#if member.flags.isInherited}
                                <p>
                                    Inherited from
                                    <a
                                        href="{discordJSLinkFromInherited(KindsToReadable[child.kind],member.inheritedFrom)}"
                                        class="visible-link"
                                        target="_blank"
                                    >
                                        {member.inheritedFrom.name}
                                    </a>
                                </p>
                            {/if}
                        </li>
                    {/if}
                {/each}
            </ul>
        {:else if KindsToReadable[child.kind] === "interface"}
            <table>
                <thead>
                    <tr>
                        <th>Property</th>
                        <th>Summary</th>
                        <th>Type</th>
                        <th>Optional</th>
                    </tr>
                </thead>
                <tbody>
                    {#each child.children as member}
                        <tr>
                            <td>{member.name}</td>
                            <td>{parseSummary(member)}</td>
                            <td>{parseType(member.type)}</td>
                            <td>{member.flags.isOptional ? "✅" : "❌"}</td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        {/if}
    {/if}
{/each}

<style lang="scss">
    .header{
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;

        > a{
            color: #b3b1b1;
            position: absolute;
            right: 1rem;
        }
    }

    ul.class-members{
        list-style-type: none;
        text-align: left;
        padding: 2rem;
        background: #111;
        border-radius: 15px;


        li:not(:last-child){
            margin-bottom: 5rem;
        }
    }

    a.visible-link{
        color: mediumpurple;
        text-decoration: underline;
    }

    a.visible-hover:hover{
        text-decoration: underline;
    }

    table{
        background-color: #111;
        text-align: center;
        overflow-x: scroll;
        display: block;
    }

    table, th, td{
        border: 1px solid #444;
        border-collapse: collapse;
    }

    tbody > tr:nth-child(odd){
        background-color: #222;
    }

    th, td{
        padding: 1rem;
    }
</style>
