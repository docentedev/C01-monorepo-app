import cities from './cities'
import Pg from '../../__mocks__/Pg'
import QueryBuilderV2 from '../../__mocks__/QueryBuilderV2'

//jest.mock('../utils/QueryBuilderV2', QueryBuilderV2)

describe('Cities', () => {
    it('getBy', async () => {
        const pg = Pg({ rows: [{ "id": 2, "name": "test" }] })
        const model = cities(pg)
        const result = await model.getBy('id', 2)
        expect(result).toEqual({ "id": 2, "name": "test" })
    })
    it('search', async () => {
        const pg = Pg({ rows: [{ "id": 3, "name": "test" }] })
        const model = cities(pg)
        const result = await model.search('test')
        expect(result).toEqual([{ "id": 3, "name": "test" }])
    })
    it('getAllPaginate', async () => {
        const pg = Pg({ rows: [{ "id": 4, "name": "test" }] })
        const model = cities(pg)
        const result = await model.getAllPaginate({ page: 1, size: 10, sort: 'asc', order: 'id' })
        expect(result.rows).toEqual([{ "id": 4, "name": "test" }])
    })
})