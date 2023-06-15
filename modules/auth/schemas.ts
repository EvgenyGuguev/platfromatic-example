import { Type } from '@sinclair/typebox';

export const loginUserSchema = {
    tags: ['auth'],
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
    tags: ['auth'],
    body: Type.Object({
        email: Type.String(),
        password: Type.String(),

    }),
    response: {
        201: Type.Ref( Type.String({ $id: 'User' }))
    }
};

export const userInfoSchema = {
    tags: ['auth'],
    response: {
        200: Type.Ref( Type.String({ $id: 'User' }))
    }
};
