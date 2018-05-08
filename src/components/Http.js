export async function request(url, options = {}) {
    const response = await fetch(url, {
        ...options,
        credentials: 'include'
    });

    if (response.status === 200) {
        return await response.json();
    } else {
        throw await response.json();
    }

}

export function get(url) {
    return request(url);
}

export function post(url, body) {
    console.log("Using POST method");
    return request(url, {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json',
        },
    });
}