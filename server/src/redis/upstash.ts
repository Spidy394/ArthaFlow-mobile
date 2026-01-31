import { Redis } from '@upstash/redis'
import { Ratelimit } from '@upstash/rateLimit'

const rateLimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(10, "60s")
});

export default rateLimit