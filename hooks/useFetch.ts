import { useEffect, useState } from "react";
import { request } from "../api/client";

// Загрузка данных с сервера: 3 состояния (data, loading, error) и повторная загрузка
export function useFetch<T>(path: string) {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [reloadKey, setReloadKey] = useState(0);

    useEffect(() => {
        let ignore = false; // true - ответ устарел

        async function load() {
            setLoading(true);
            setError(null);
            try {
                const result = await request<T>(path);
                if (!ignore) setData(result);
            } catch (e) {
                if (!ignore) {
                    setError(e instanceof Error ? e.message : "Неизвестная ошибка");
                }
            } finally {
                if (!ignore) setLoading(false);
            }
        }

        load();
        return () => {
            ignore = true; 
        };
    }, [path, reloadKey]);

    function reload() {
    setReloadKey((key) => key + 1);
    }

    return { data, loading, error, reload };
}