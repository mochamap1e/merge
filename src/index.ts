import ollama from "ollama";
import { Elysia, t } from "elysia";
import { cors } from "@elysia/cors";
import { staticPlugin } from "@elysia/static";

async function prompt(prompt: string, json: boolean, system?: string) {
    const { response } = await ollama.generate({
        model: "merge-model",
        format: json ? "json" : "",
        prompt,
        system: system || "",
        stream: false
    });

    return response;
}

new Elysia()
    .use(cors({ origin: "*" }))
    .use(staticPlugin({ prefix: "/" }))

    .post("/start", async ({ status }) => {
        try {
            const goal = await prompt(
                "Think of a random thing that exists in the universe. Respond with only this thing and no other text.",
                false
            );

            console.log(goal);
        } catch(error) {
            console.error(error);
            return status(500);
        }
    })

    .post("/merge", async ({ body, status }) => {
        try {
            const merged = await prompt(
                `${body.a} + ${body.b}`,
                true,
                `
                    You are an item combination system that takes 2 items and combines them into one, while picking an emoji that fits the new item.

                    Rules:
                    - ONLY output valid JSON. No explanations or other text besides JSON.
                    - The key-value pairs in the JSON must all have quotation marks in order to prevent parsing errors.
                    - Your JSON must follow this schema, no adding, removing, or changing any fields:
                    { "result": "<new item>", "emoji": "<fitting emoji>" }

                    Combination methods (sorted by priority):
                    - Real-world elemental or logical combinations (Water + Fire = Steam 💨, Sodium + Chloride = 🧂 Salt)
                    - Existing words, titles, franchises, brands, concepts, or memes (Geometry + Dash = Geometry Dash 👾)
                    - Mathematical or symbolic operations (1 + 5 = 6 ➕)
                    - String manipulation (Remove X + Xbox = Box 📦)
                    - Creative combinations (Dragon + Computer = Cyber Dragon 🤖)
                `
            );

            let json;

            try {
                json = JSON.parse(merged);
                json.success = true;
                console.log("Merged", body.a, "with", body.b, "to make", json.emoji, json.result);
            } catch(error) {
                json = { success: false };
                console.log("Invalid json:", merged);
            }

            return json;
        } catch(error) {
            console.error(error);
            return status(500);
        }
    }, {
        body: t.Object({
            a: t.String({ minLength: 1 }),
            b: t.String({ minLength: 1 })
        })
    })

    .listen(3000, ({ port }) => console.log("App running on port", port));