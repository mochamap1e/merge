import { Elysia, t } from "elysia";
import { cors } from "@elysia/cors";
import { staticPlugin } from "@elysia/static";
import axios from "axios";

const app = new Elysia()
    .use(cors())

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

            console.log(content);

            const response = JSON.parse(content + "}");

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

    .listen(3050, ({ port }) => console.log("App running on port", port));

if (!process.argv.includes("-dev")) app.use(staticPlugin({ prefix: "/" }));