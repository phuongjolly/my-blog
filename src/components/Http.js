export async function request(url, options = {}) {
    const response = await fetch(url, {
        ...options,
        credentials: 'include'
    });
    return await response.json();
}

export function get(url) {
    return request(url);
}

export function post(url, body) {
    return request(url, {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json',
        },
    });
}