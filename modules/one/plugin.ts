/// <reference path="../../global.d.ts" />
import { Type } from '@sinclair/typebox';
import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'

const plugin: FastifyPluginAsyncTypebox = async function(fastify, _opts) {
  fastify.log.info("ONE module loaded");

  const getSchema =  {
    tags: ['one'],
    querystring: Type.Object({
      name: Type.String({ default: 'world' })
    }),
    response: {
      200: Type.Object({
        hello: Type.String()
      })
    }
  };
  
  fastify.get('/', { schema: getSchema }, async (req, _res) => {
    const { name } = req.query;
    return { hello: name };
  });

  const postSchema = {
    tags: ['one'],
    body: Type.Object({
      name: Type.String()
    }),
    response: {
      200: Type.Object({
        hello: Type.String()
      }),
      400: Type.Object({
        statusCode: Type.Number(),
        code: Type.String(),
        error: Type.String(),
        message: Type.String()      
      })
    }
  };
    
  fastify.post('/', { schema: postSchema }, async (req, _res) => {
    const { name } = req.body;
    return { hello: name || 'world' };
  });
}

export default plugin;
