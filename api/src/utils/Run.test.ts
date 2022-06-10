import Run from './Run'

describe('Run', () => {
    it('should run a query', async () => {
        const run = Run({
            connect: (callback: Function) => {
                const client = {
                    query: (sql: string, callback: Function) => {
                        callback(null, {
                            rows: [{
                                id: 1,
                                name: 'test'
                            }]
                        })
                    }
                }
                callback(null, client, async () => Promise.resolve())
            },
        })
        const result = await run('SELECT 1', [], true)
        expect(result).toEqual({ "id": 1, "name": "test" })
    })
});