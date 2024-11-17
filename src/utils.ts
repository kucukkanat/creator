export async function AlterPackageJSON(obj: object) {
    const json = GetPackageJSON();
    if (json === null) {
        console.error("No package.json found in the current working directory");
        Deno.exit(1);
    }
    const altered = Object.assign(json, obj);
    await Deno.writeFile(
        "package.json",
        new TextEncoder().encode(JSON.stringify(altered, null, 2)),
    );
    return altered;
}

function GetPackageJSON() {
    const decoder = new TextDecoder("utf-8");
    try {
        const packageJSON = Deno.readFileSync("package.json");
        const packageJSONString = decoder.decode(packageJSON);
        return JSON.parse(packageJSONString);
    } catch (e) {
        return null;
    }
}
