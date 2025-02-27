export interface UserStorage {
    token: string
    user: {
        id: number
        name: string
        email: string
    }
}