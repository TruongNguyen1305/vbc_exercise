export type LoginDto = {
    username: string,
    password: string,
}

export type JwtPayload = {
    id: number;
    username: string;
    isAdmin: boolean;
}