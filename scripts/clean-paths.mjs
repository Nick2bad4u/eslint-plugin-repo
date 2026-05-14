import { rm } from "node:fs/promises";
import { resolve } from "node:path";

const [
    ,
    ,
    ...targets
] = process.argv;

if (targets.length === 0) {
    throw new TypeError("At least one path must be provided.");
}

await Promise.allSettled(
    targets.map(async (target) => {
        const absoluteTarget = resolve(target);
        await rm(absoluteTarget, { force: true, recursive: true });
    })
);
