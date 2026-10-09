const store = new Map()

export async function cached(key, ttlMs, load) {
    const hit = store.get(key)
    if (hit && hit.expires > Date.now()) return hit.value

    const value = await load()
    store.set(key, { value, expires: Date.now() + ttlMs })
    return value
}

export function clearCache() {
    store.clear()
}
