import { apiRequest } from "./RESTapi";

export function login(email: string, password: string) {
return apiRequest("/api/a/auth/login", {
method: "POST",
body: JSON.stringify({ email, password}),
});
}

export function register(name:string, email: string, password: string) {
return apiRequest("/api/a/auth/register", {
method: "POST",
body: JSON.stringify({name, email, password}),
});
}

export function me() {
return apiRequest("/api/a/auth/me", {
method: "GET",
});
}













