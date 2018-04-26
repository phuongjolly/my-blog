export async function request(url, options = {}) {
    const response = await fetch(url, {
        ...options,
        credentials: 'include'
    });
    try {
        const value = await response.json();
        return value;
    }
    catch (e) {
        return null;
    }

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