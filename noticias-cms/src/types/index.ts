export interface News {
    id: string;
    title: string;
    content: string;
    author: string;
    category: string;
    imageUrl?: string;
    createdAt: Date;
    updatedAt: Date;
    status: 'Edición' | 'Terminado' | 'Publicado' | 'Desactivado';
}

export interface User {
    id: string;
    email: string;
    displayName?: string;
}

export interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>; 
}