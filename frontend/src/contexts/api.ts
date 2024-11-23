import { createContext } from "react";
import { Category, Todo } from "@/schema";

type PaginatedResponse<T> = {
    limit: number;
    page: number;
    results: T[];
    total_pages: number;
    total_results: number;
};

export class AccessDeniedException extends Error {
    constructor() {
        super("Access denied");
    }
}

export class NotFoundException extends Error {
    constructor() {
        super("Not found");
    }
}

export class UnknownErrorException extends Error {
    constructor(statusCode: number, message: string) {
        super(`Unknown error (status ${statusCode}): ${message}`);
    }
}

export class TodosApi {
    constructor(private baseUrl: string = "") { }

    // Authentication
    async register(username: string, email: string, password: string) {
        const res = await fetch(`${this.baseUrl}/api/register/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: username,
                email: email,
                password: password,
            }),
        });

        if (res.status === 401) {
            throw new AccessDeniedException();
        }

        if (res.status !== 201) {
            throw new UnknownErrorException(res.status, await res.text());
        }
    }

    async login(username: string, password: string) {
        const res = await fetch(`${this.baseUrl}/api/login/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: username,
                password: password,
            }),
        });

        if (res.status === 401) {
            throw new AccessDeniedException();
        }

        if (res.status !== 200) {
            throw new UnknownErrorException(res.status, await res.text());
        }

        const { token } = (await res.json()) as { token: string };

        return token;
    }

    async logout(token: string) {
        await fetch(`${this.baseUrl}/api/logout/`, {
            method: "POST",
            headers: {
                Authorization: `Token ${token}`,
                "Content-Type": "application/json",
            },
        });
    }

    // Todos CRUD
    async create(token: string, description: string) {
        const res = await fetch(`${this.baseUrl}/api/todos/`, {
            method: "POST",
            headers: {
                Authorization: `Token ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                description: description,
            }),
        });

        if (res.status === 401) {
            throw new AccessDeniedException();
        }

        if (res.status !== 201) {
            throw new UnknownErrorException(res.status, await res.text());
        }

        return res.json() as Promise<Todo>;
    }

    async list(token: string) {
        const res = await fetch(`${this.baseUrl}/api/todos/`, {
            headers: {
                Authorization: `Token ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (res.status === 401) {
            throw new AccessDeniedException();
        }

        if (res.status !== 200) {
            throw new UnknownErrorException(res.status, await res.text());
        }

        return res.json() as Promise<PaginatedResponse<Todo>>;
    }

    async get(token: string, id: number) {
        const res = await fetch(`${this.baseUrl}/api/todos/${id}/`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",

            },
        });

        if (res.status === 404) {
            throw new NotFoundException();
        }

        if (res.status === 401) {
            throw new AccessDeniedException();
        }

        if (res.status !== 200) {
            throw new UnknownErrorException(res.status, await res.text());
        }

        return res.json() as Promise<Todo>;
    }

    async update(token: string, id: number, description: string | undefined, is_completed: boolean | undefined) {
        const res = await fetch(`${this.baseUrl}/api/todos/${id}/`, {
            method: "PATCH",
            headers: {
                Authorization: `Token ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                description: description,
                is_completed: is_completed,
            }),
        });

        if (res.status === 401) {
            throw new AccessDeniedException();
        }

        if (res.status !== 200) {
            throw new UnknownErrorException(res.status, await res.text());
        }

        return res.json() as Promise<Todo>;
    }

    async updateTodoCategories(token: string, id: number, categories: number[]) {
        const res = await fetch(`${this.baseUrl}/api/todos/${id}/`, {
            method: "PATCH",
            headers: {
                Authorization: `Token ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                category: categories,
            }),
        });

        if (res.status === 401) {
            throw new AccessDeniedException();
        }

        if (res.status !== 200) {
            throw new UnknownErrorException(res.status, await res.text());
        }

        return res.json() as Promise<Todo>;
    }

    async delete(token: string, id: number) {
        const res = await fetch(`${this.baseUrl}/api/todos/${id}/`, {
            method: "DELETE",
            headers: {
                Authorization: `Token ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (res.status === 401) {
            throw new AccessDeniedException();
        }

        if (res.status !== 204) {
            throw new UnknownErrorException(res.status, await res.text());
        }
    }

    // Categories CRUD
    async createCategory(token: string, name: string) {
        const res = await fetch(`${this.baseUrl}/api/categories/`, {
            method: "POST",
            headers: {
                Authorization: `Token ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: name,
            }),
        });

        if (res.status === 401) {
            throw new AccessDeniedException();
        }

        if (res.status !== 201) {
            throw new UnknownErrorException(res.status, await res.text());
        }

        return res.json() as Promise<Category>;
    }

    async listCategories(token: string) {
        const res = await fetch(`${this.baseUrl}/api/categories/`, {
            headers: {
                Authorization: `Token ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (res.status === 401) {
            throw new AccessDeniedException();
        }

        if (res.status !== 200) {
            throw new UnknownErrorException(res.status, await res.text());
        }

        return res.json() as Promise<PaginatedResponse<Category>>;
    }

    async getCategory(token: string, id: number) {
        const res = await fetch(`${this.baseUrl}/api/todos/${id}/`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",

            },
        });

        if (res.status === 404) {
            throw new NotFoundException();
        }

        if (res.status === 401) {
            throw new AccessDeniedException();
        }

        if (res.status !== 200) {
            throw new UnknownErrorException(res.status, await res.text());
        }

        return res.json() as Promise<Category>;
    }

    async deleteCategory(token: string, id: number) {
        const res = await fetch(`${this.baseUrl}/api/categories/${id}/`, {
            method: "DELETE",
            headers: {
                Authorization: `Token ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (res.status === 401) {
            throw new AccessDeniedException();
        }

        if (res.status !== 204) {
            throw new UnknownErrorException(res.status, await res.text());
        }
    }
}

export const ApiContext = createContext<TodosApi>(new TodosApi())