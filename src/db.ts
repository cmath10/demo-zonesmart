import type { User } from '@/domain/user'

const store_name = 'credentials'
const store_key = 'user'

function openDb() {
    return new Promise<IDBDatabase>((resolve, reject) => {
        const request: IDBOpenDBRequest = indexedDB.open('zs-demo', 1)

        request.onupgradeneeded = () => {
            const db: IDBDatabase = request.result
            if (!db.objectStoreNames.contains(store_name)) {
                db.createObjectStore(store_name, { autoIncrement: true })
            }
        }

        request.onsuccess = () => resolve(request.result)
        request.onerror = reject
    })
}

export const get = async () => {
    const db = await openDb()

    const transaction = db.transaction(store_name, 'readonly')
    const store = transaction.objectStore(store_name)

    const request = store.get(store_key)

    return new Promise<User | null>((resolve, reject) => {
        request.onsuccess = () => resolve(request.result ?? null)
        request.onerror = reject
    })
}

export const put = async (user: User) => {
    const db = await openDb()

    const transaction = db.transaction(store_name, 'readwrite')
    const store = transaction.objectStore(store_name)

    store.clear().onsuccess = () => {
        store.put(user, store_key)
    }

    return new Promise((resolve, reject) => {
        transaction.oncomplete = resolve
        transaction.onerror = reject
        transaction.onabort = reject
    })
}

export const clear = async () => {
    const db = await openDb()

    const transaction = db.transaction(store_name, 'readwrite')
    const store = transaction.objectStore(store_name)

    store.clear()

    return new Promise((resolve, reject) => {
        transaction.oncomplete = resolve
        transaction.onerror = reject
        transaction.onabort = reject
    })
}