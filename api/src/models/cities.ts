import { initQueryBuilder } from "../utils/QueryBuilderV2"
import Run from '../utils/Run'

interface GetAllPaginateProps {
    page: number
    size: number
    order: string
    sort: 'asc' | 'desc'
}

const cities = (pg: pg.Pg) => {
    const qb = initQueryBuilder({
        table: 'city',
        as: ['country as co', 'city as c'],
        fields: ['id', 'name', 'admin_name'],
        select: 'c.id, c.name, c.admin_name',
        run: Run(pg)
    })
    const getAllPaginate = async ({ page = 1, size = 10, sort = 'desc', order = 'id' }: GetAllPaginateProps) => {
        try {
            const result = qb().select().orderBy(order, sort).paginate(page, size)
            const count = await qb().count().run()
            return {
                count: Number(count.count),
                rows: await result.run()
            }
        } catch (error) {
            throw error
        }
    }
    const getBy = async (key: string, value: any) => {
        try {
            const result = await qb().selectOne().where([key], value).run()
            return result
        } catch (error) {
            throw error
        }
    }

    const search = async (value: any) => {
        try {
            const query = qb()
                .select('c.id, c.name, c.admin_name, co.nicename as country_name')
                .innerJoin({ join: 'country.iso', on: 'c.country_iso_fk' })
                .where(['c.name', 'c.admin_name'], value, 'ILIKE')
            const result = await query.run()
            return result
        } catch (error) {
            throw error
        }
    }

    return {
        getAllPaginate,
        getBy,
        search
    }
}

export default cities
