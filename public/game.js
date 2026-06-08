const URL = "http://localhost:3050";

async function mergeRequest(item1, item2) {
    try {
        const request = await fetch(URL + "/merge", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ a: item1, b: item2 })
        });

        const response = await request.json();

        document.getElementById("result").textContent = `Result: ${response.emoji} ${response.result}`;
    } catch(error) {
        return console.error(error);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const item1 = document.getElementById("item1");
    const item2 = document.getElementById("item2");
    const merge = document.getElementById("merge");

    merge.addEventListener("click", () => mergeRequest(item1.value, item2.value));
});