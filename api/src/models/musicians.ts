import { initQueryBuilder, IMutation, Utils } from "../utils/QueryBuilderV2"
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
    const fields = ['first_name', 'last_name', 'second_last_name', 'second_name', 'birth_date', 'death_name', 'city_fk', 'alias']
    const qb = initQueryBuilder<Musician>({
        table: 'musician',
        as: ['country as co', 'city as c', 'musician as m'],
        fields: ['id', 'first_name', 'last_name', 'country.name', 'city.name'],
        mutationFields: ['id', 'first_name', 'last_name', 'second_last_name', 'second_name', 'birth_date', 'death_date', 'city_fk', 'alias', 'city_name', 'country_name'],
        select: 'm.id, m.first_name, m.last_name, m.second_last_name, m.second_name, m.birth_date, m.death_date, m.city_fk, m.alias, c.name as city_name, co.nicename as country_name, image',
        run: Run(pg)
    })
    const qbMutation = initQueryBuilder<Musician>({
        table: 'musician',
        fields: ['id', 'first_name', 'last_name', 'country.name', 'city.name'],
        mutationFields: ['id', 'first_name', 'last_name', 'second_last_name', 'second_name', 'birth_date', 'death_date', 'city_fk', 'alias', 'city_name', 'country_name', 'image'],
        run: Run(pg)
    })
    const getAllPaginate = async ({ page = 1, size = 10, sort = 'desc', order = 'id' }: GetAllPaginateProps) => {
        try {
            const result = await qb()
                .select()
                .innerJoin({ join: 'city.id', on: 'm.city_fk' })
                .innerJoin({ join: 'country.iso', on: 'c.country_iso_fk' })
                .orderBy(order, sort)
                .paginate(page, size)
                .run()
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
            const result = qb().selectOne().innerJoin({ join: 'city.id', on: 'm.city_fk' }).innerJoin({ join: 'country.iso', on: 'c.country_iso_fk' }).where(key, value)
            return await result.run()
        } catch (error) {
            throw error
        }
    }

    const insert = async (musician: any) => {
        try {
            const data = Utils.getAllowedField(fields, musician)
            const result = await qbMutation().insert(data).run()
            return result
        } catch (error) {
            throw error
        }
    }

    const update = async (id: any, musician: any) => {
        try {
            const data = Utils.getAllowedField(fields, musician)
            const result = await qbMutation().update(data).where('id', id).run()
            return result
        } catch (error) {
            throw error
        }
    }

    const updateImage = async (id: any, fileName: string) => {
        try {
            const data = Utils.getAllowedField(['image'], { image: fileName })
            await qbMutation().update(data).where('id', id).run()
            const result = await getBy('id', id)
            return result
        } catch (error) {
            throw error
        }
    }

    const deleteById = async (id: any) => {
        try {
            const result = await qbMutation().delete().where('id', id).run()
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
        deleteById,
        updateImage
    }
}

export default musicians
