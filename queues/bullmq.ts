import {Queue, Worker, QueueEvents} from "bullmq";
import {FastifyInstance} from "fastify";

// bullMQ test

export async function testQueue(app: FastifyInstance)  {
    const redisConnectionOptions = { connection: {
        host: "localhost",
        port: 6379
    }};

    // create queue
    const myQueue = new Queue('test', redisConnectionOptions);

    // create worker for process jobs from queue
    new Worker('test', async job => {
        const number = Math.exp(job.data.number);
        // if (job.data.title === 'test_1') console.log('JOB!!!');
        return `${job.data.title}, number: ${number}`;
    }, redisConnectionOptions);

    // listening queue events
    const queueEvents = new QueueEvents('test', redisConnectionOptions);

    queueEvents.on('waiting', ({ jobId }) => {
        app.log.info(`A job with ID ${jobId} is waiting`);
    });

    queueEvents.on('active', ({ jobId, prev }) => {
        app.log.info(`Job ${jobId} is now active; previous status was ${prev}`);
    });

    queueEvents.on('completed', ({ jobId, returnvalue }) => {
        app.log.info(`${jobId} has completed and returned ${returnvalue}`);
    });

    queueEvents.on('failed', ({ jobId, failedReason }) => {
        app.log.info(`${jobId} has failed with reason ${failedReason}`);
    });

    // add jobs to queue
    async function addJobs() {
        await myQueue.add('jobOne', { title: 'test_1', number: 34 }, {delay: 1000});
        await myQueue.add('jobTwo', { title: 'test_2', number: 55 });
    }

    await addJobs();
}
