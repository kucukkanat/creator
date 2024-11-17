import { InitWithVite } from "#/utils.ts";

const validate = {
    scope: (name: string) => {
        if (name.includes("@")) {
            console.log("The scope should not include the '@' symbol");
            Deno.exit(1);
        }
    },
};

export default function (options: any, name: string) {
    if (options.debug) console.log("Creating package", { options, name });
    validate.scope(name);

    InitWithVite({
        name: options.scope ? `@${options.scope}/${name}` : name,
        template: options.template,
        useBun: options.useBun,
    });
}
