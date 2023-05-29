/// <reference path="../../global.d.ts" />
import { FastifyInstance } from 'fastify'
import {EntityHooks} from '@platformatic/sql-mapper';

export default async function (app: FastifyInstance) {
    console.log("Loaded TWO module");

    app.platformatic.addEntityHooks("movie", ({
    async save(original, { input, ...rest }){
      // input.title = 'platformatic';
        console.log(input.title);

      return original({ input, ...rest });
    }
  } as EntityHooks))
}