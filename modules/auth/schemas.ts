import { Type } from '@sinclair/typebox';

export const loginUserSchema = {
    body: Type.Object({
        email: Type.String(),
        password: Type.String(),

    }),
    response: {
        200: Type.Object({
            token: Type.String()
        })
    }
};

export const registerUserSchema = {
    body: Type.Object({
        email: Type.String(),
        password: Type.String(),

    }),
    response: {
        201: Type.Object({
            id: Type.Number(),
            email: Type.String(),
            password: Type.String(),
        })
    }
};
