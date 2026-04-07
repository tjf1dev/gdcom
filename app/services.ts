import { Creator, FullLevel } from "./types/level";
const levelCache = new Map<string, FullLevel>()
const levelDataCache = new Map<string, FullLevel>()
function safeDecodeBase64(str: string): string {
    try {
        return Buffer.from(str, "base64").toString("utf-8");
    } catch {
        return str;
    }
}
function unpackLevelCreator(creator: string): Creator {
    const tokens = creator.split(":");
    return {
        userId: Number(tokens[0]),
        username: tokens[1],
        accountId: Number(tokens[2]),
    };
}
export function unpackLevelResponse(data: string, type: "download" | "get"): FullLevel {
    console.log(data);
    let levelPart: string;
    let creatorPart: string | undefined;
    // let songPart: string | undefined;

    if (type === "download") {
    [levelPart, , , creatorPart,] = data.split("#");
    } else {
    [levelPart, creatorPart] = data.split("#");
    }
    const levelObjects = levelPart.split("|");
    const levelObject = levelObjects[0];
    let creator: Creator | null = null;
    if (creatorPart) creator = unpackLevelCreator(creatorPart);
    const tokens = levelObject.split(":");
    const rawLevel: Record<string, string> = {};
    for (let i = 0; i < tokens.length; i += 2) {
        const key = tokens[i];
        const value = tokens[i + 1] ?? ""; rawLevel[key] = value;
    }
    const level: FullLevel = {
        id: Number(rawLevel["1"]),
        name: rawLevel["2"],
        description: safeDecodeBase64(rawLevel["3"]),
        data: rawLevel["4"],
        author_gd_id: creator?.accountId,
        author_name: creator?.username,
        downloads: Number(rawLevel["10"]),
        version: rawLevel["5"],
        likes: Number(rawLevel["14"]),
        stars: Number(rawLevel["18"]),
        demonDifficulty: Number(rawLevel["43"]),
        demon: Boolean(rawLevel["17"])
    }; return level;
}
export async function downloadLevel(id: string): Promise<FullLevel | null> {
    if (levelDataCache.has(id)) return levelDataCache.get(id)!
    const formData = new FormData();
    formData.append("secret", "Wmfd2893gb7");
    formData.append("levelID",id);

    const r = await fetch("http://www.boomlings.com/database/downloadGJLevel22.php", {
        method: "POST",
        body: formData,
        headers: { "User-Agent": "" }, 
        // next: { revalidate: 300 },
    })
    if(!r.ok){
        console.error(`downloadGJLevel22 failed. ${r.status}`)
    }
    const data = await r.text()
    if(data == "-1"){
        console.error(`downloadGJLevel22 returned -1`)
    }
    const level = unpackLevelResponse(data, "download")
    levelDataCache.set(id, level)
    return level
}
export async function fetchLevelInfo(id: string): Promise<FullLevel | null> {
    if (levelCache.has(id)) return levelCache.get(id)!
    const formData = new FormData();
    formData.append("secret", "Wmfd2893gb7");
    formData.append("str", id);
    formData.append("type", "0");

    const r = await fetch("http://www.boomlings.com/database/getGJLevels21.php", {
        method: "POST",
        body: formData,
        headers: { "User-Agent": "" },
        //  next: { revalidate: 300 },
    })
    if(!r.ok){
        console.error(`getGJLevel21 failed. ${r.status}`)
    }
    const data = await r.text()
    if(data == "-1"){
        console.error(`getGJLevel21 returned -1`)
    }
    const level = unpackLevelResponse(data, "get")
    levelCache.set(id, level)
    return level
}