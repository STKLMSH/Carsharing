// Все запросы к серверу идут через этот модуль
export const SERVER_URL = "http://10.1.1.83:3000";

export async function request<T>(path: string, init?: RequestInit): Promise<T> {
    let response: Response;
    // fetch выкидывает исключение, только если сервер выключен или неверный адрес
    try {
        response = await fetch(`${SERVER_URL}/api${path}`, init);
    } catch {
    throw new Error("Сервер недоступен");
}

    const data = await response.json().catch(() => null);
    if (!response.ok) {
        const message = data?.error ?? `Сервер вернул ${response.status}`;
        throw new Error(message);
    }
    return data as T;
}

// Запрос с JSON-телом: общий код для POST и PATCH
// Без заголовка Content-Type сервер не заполнит req.body
function sendJson<T>(method: string, path: string, body: unknown): Promise<T> {
    return request<T>(path, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });
}

export function postJson<T>(path: string, body: unknown): Promise<T> {
    return sendJson<T>("POST", path, body);
}

export function patchJson<T>(path: string, body: unknown): Promise<T> {
    return sendJson<T>("PATCH", path, body);
}


// Картинки раздаёт сервер
export function imageUrl(path: string) {
    return `${SERVER_URL}${path}`;
}