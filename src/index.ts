import { Elysia, t } from "elysia";
import { cors } from "@elysia/cors";
import { staticPlugin } from "@elysia/static";
import axios from "axios";

new Elysia()
    .use(cors({ origin: "*" }))
    .use(staticPlugin({ prefix: "/" }))

    .post("/merge", async ({ body, status }) => {
        try {
            const { data: { message: { content } } } = await axios.post("http://localhost:11434/api/chat", {
                model: "merge-model",
                messages: [
                    {
                        role: "user",
                        content: `${body.a} + ${body.b}`
                    }
                ],
                stream: false
            });

            let response;

            try {
                response = JSON.parse(content + "}");
                response.success = true;
            } catch(error) {
                console.log("Invalid json:", content);
                response = { success: false };
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