import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import cp from "node:child_process";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { walk } = require("walk");

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const RESULTS_DIR_PATH = path.join(__dirname,"../","results");
const JSON_RESULTS_PATH = path.join(__dirname,"../","results/json");
const WEB_RESULTS_PATH = path.join(__dirname,"../","results/web");

const DISCMJS_PATH = path.join(__dirname,"../","node_modules/discm.js/src/lib");
const TYPEDOC_PATH = path.join(__dirname,"../","node_modules/.bin/typedoc");
const TSCONFIG_PATH = path.join(__dirname,"../","typedoc-tsconfig.json");
const README_PATH = path.join(__dirname,"../","node_modules/discm.js/README.md");

export interface FetchNodeError{
    success: false;
    body: null;
}

export interface FetchNodeSuccess{
    success: true;
    body: object;
}

export type FetchNodeResult = FetchNodeError | FetchNodeSuccess;

export function getReadme(){
    const readme = fs.readFileSync(README_PATH).toString();

    return readme;
}

async function getTypedoc(item: string,type: string): Promise<object>{
    const filePath = path.join(DISCMJS_PATH,type,item + ".ts");

    return await new Promise((resolve,reject) => {
        const childProcess = cp.exec(
            `${TYPEDOC_PATH} ${filePath} --json ${path.join(JSON_RESULTS_PATH,`${type}_${item}` + ".json")} --out ${path.join(WEB_RESULTS_PATH,`${type}_${item}`)} --tsconfig ${TSCONFIG_PATH}`
        );

        childProcess.on("exit", () => {
            resolve(
                JSON.parse(fs.readFileSync(
                    path.join(JSON_RESULTS_PATH,`${type}_${item}` + ".json")
                ).toString("utf-8"))
            );
        });

        childProcess.on("error", reject);
    });
}

export async function fetchNode(item: string,type: string): Promise<FetchNodeResult> {
    if(item === "DiscmClient") item = "Client";
    if(type === "types" && ["AnyCommand","AnyEvent","AnyCommandTextOption","ParsedCommand"].includes(item)) item = "aliases";
    else if(type === "types") item = "interfaces";

    return {
        success: fs.existsSync(path.join(JSON_RESULTS_PATH,`${type}_${item}` + ".json")),
        body: fs.existsSync(path.join(JSON_RESULTS_PATH,`${type}_${item}` + ".json")) ? JSON.parse(fs.readFileSync(
            path.join(JSON_RESULTS_PATH,`${type}_${item}` + ".json")
        ).toString("utf-8")) : null
    }
}

export let initialized = false;

export function init(version?: string){
    if(!fs.existsSync(RESULTS_DIR_PATH))
        fs.mkdirSync(RESULTS_DIR_PATH);

    if(!fs.existsSync(JSON_RESULTS_PATH))
        fs.mkdirSync(JSON_RESULTS_PATH);

    if(!fs.existsSync(WEB_RESULTS_PATH))
        fs.mkdirSync(WEB_RESULTS_PATH);

    cp.exec(`pnpm i discm.js@${version ? version : "latest"}`);

    const walker = walk(DISCMJS_PATH);

    walker.on("file",async (pathname, { name: filename }, next) => {
        const dirs = pathname.split("\\");
        let type = dirs[dirs.length - 1];
        let item = filename.replace(".ts","");

        if(item === "DiscmClient") item = "Client";
        if(type === "types" && ["AnyCommand","AnyEvent","AnyCommandTextOption","ParsedCommand"].includes(item)) item = "aliases";
        else if(type === "types") item = "interfaces";
        if(fs.existsSync(path.join())) return next();
        
        await getTypedoc(item,type);

        next();
    });

    initialized = true;
}
