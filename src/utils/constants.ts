// `process` exists in Node/Cypress but not in the browser bundle. `typeof`
// lets browser code fall back safely without evaluating an undefined global
// proccess existe en node pero no en el browser bundle, asi que le dejamos hacer un fall back sin fallar
const nodeEnvironment = typeof process === "undefined" ? undefined : process.env

export const FRONTEND_URL = nodeEnvironment?.FRONTEND_URL ?? "http://localhost:5173"
export const BACKEND_URL = "/api"
export const AUTH0_USERNAME = nodeEnvironment?.AUTH0_USERNAME ?? ""
export const AUTH0_PASSWORD = nodeEnvironment?.AUTH0_PASSWORD ?? ""
