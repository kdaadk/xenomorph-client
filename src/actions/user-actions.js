export const UPDATE_USER = 'users:updateUser'

export function updateUser(newUser, state) {
    return { ...state, user: newUser}
}