async function request(endpoint, body) {
    try {
        const request = await fetch(window.location.href + endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body
        });

        const response = await request.json();
        return response;
    } catch(error) {
        return console.error(error);
    }
}

async function mergeRequest(item1, item2) {
    const request = await fetch(window.location.href + "merge", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ a: item1, b: item2 })
    });

    const response = await request.json();
    const result = document.getElementById("result");

    if (response.success) {
        result.textContent = `Result: ${response.emoji} ${response.result}`;
    } else {
        result.textContent = "Failed";
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const item1 = document.getElementById("item1");
    const item2 = document.getElementById("item2");
    const merge = document.getElementById("merge");

    merge.addEventListener("click", () => mergeRequest(item1.value, item2.value));
});