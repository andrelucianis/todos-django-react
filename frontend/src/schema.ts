export type Todo = {
    id: string;
    description: string;
    is_completed: boolean;
    created_at: string;
    category: Category[];
};

export type Category = {
    id: string;
    name: string;
};