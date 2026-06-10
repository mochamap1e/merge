import ollama from "ollama";
import { Elysia, t } from "elysia";
import { cors } from "@elysia/cors";
import { staticPlugin } from "@elysia/static";

new Elysia()
    .use(cors({ origin: "*" }))
    .use(staticPlugin({ prefix: "/" }))

    .post("/merge", async ({ body, status }) => {
        try {
            const { response } = await ollama.generate({
                model: "merge-model",
                format: "json",
                prompt: `${body.a} + ${body.b}`,
                stream: false
            });

            let json;

            try {
                json = JSON.parse(response + "}");
                json.success = true;
            } catch(error) {
                console.log("Invalid json:", response);
                json = { success: false };
            }

            return response;
        } catch(error) {
            console.log(error);
            return status(500);
        }
    }, {
        body: t.Object({
            a: t.String(),
            b: t.String()
        })
    })

    .listen(3000, ({ port }) => console.log("App running on port", port));