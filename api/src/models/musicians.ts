import { initQueryBuilder, IMutation } from "../utils/QueryBuilderV2"
import Run from '../utils/Run'

interface GetAllPaginateProps {
    page: number
    size: number
    order: string
    sort: 'asc' | 'desc'
}

interface Musician extends IMutation {
    id?: string
    first_name: string
    last_name: string
    second_last_name?: string
    second_name?: string
    birth_date: Date
    death_date: Date
    city_fk: number
    alias: string
}

const musicians = (pg: pg.Pg) => {
    const qb = initQueryBuilder<Musician>({
        table: 'musician',
        as: ['country as co', 'city as c', 'musician as m'],
        fields: ['id', 'first_name', 'last_name', 'country.name', 'city.name'],
        mutationFields: ['id', 'first_name', 'last_name', 'second_last_name', 'second_name', 'birth_date', 'death_date', 'city_fk', 'alias', 'city_name', 'country_name'],
        select: 'm.id, m.first_name, m.last_name, m.second_last_name, m.second_name, m.birth_date, m.death_date, m.city_fk, m.alias, c.name as city_name, co.nicename as country_name',
        run: Run(pg)
    })
    const qbm = initQueryBuilder<Musician>({
        table: 'musician',
        fields: ['id', 'first_name', 'last_name', 'country.name', 'city.name'],
        mutationFields: ['id', 'first_name', 'last_name', 'second_last_name', 'second_name', 'birth_date', 'death_date', 'city_fk', 'alias', 'city_name', 'country_name'],
        run: Run(pg)
    })
    const getAllPaginate = async ({ page = 1, size = 10, sort = 'desc', order = 'id' }: GetAllPaginateProps) => {
        try {
            const result = await qb().select().innerJoin({ join: 'city.id', on: 'm.city_fk' }).innerJoin({ join: 'country.iso', on: 'c.country_iso_fk' }).orderBy(order, sort).paginate(page, size).run()
            const count: any = await qb().count().run()
            return {
                count: Number(count.count),
                rows: result
            }
        } catch (error) {
            console.log(error)
            throw error
        }
    }
    const getBy = async (key: string, value: any) => {
        try {
            const result = qb().selectOne().innerJoin({ join: 'city.id', on: 'm.city_fk' }).innerJoin({ join: 'country.iso', on: 'c.country_iso_fk' }).where([key], value)
            return await result.run()
        } catch (error) {
            throw error
        }
    }

    const insert = async (musician: any) => {
        try {
            const data = {
                first_name: musician.first_name,
                last_name: musician.last_name,
                second_last_name: musician.second_last_name,
                second_name: musician.second_name,
                birth_date: musician.birth_date,
                death_date: musician.death_date,
                city_fk: musician.city_fk,
                alias: musician.alias
            }
            const result = await qbm().insert(data).run()
            return result
        } catch (error) {
            throw error
        }
    }

    const update = async (id: any, musician: any) => {
        try {
            const data = {
                first_name: musician.first_name,
                last_name: musician.last_name,
                second_last_name: musician.second_last_name,
                second_name: musician.second_name,
                birth_date: musician.birth_date,
                death_date: musician.death_date,
                city_fk: musician.city_fk,
                alias: musician.alias
            }
            console.log(qbm().update(data).where(['id'], id).build())
            const result = await qbm().update(data).where(['id'], id).run()
            return result
        } catch (error) {
            throw error
        }
    }

    const deleteById = async (id: any) => {
        try {
            const result = await qbm().delete().where(['id'], id).run()
            return result
        } catch (error) {
            throw error
        }
    }

    return {
        getAllPaginate,
        getBy,
        insert,
        update,
        deleteById
    }
}

export default musicians
