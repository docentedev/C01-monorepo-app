const Run = (pg: any) => async (sql: string, values: any[], single: Boolean) => {
    return new Promise((resolve: (result: any) => void, reject: (err: Error) => void) => {
        pg.connect((err: Error, client: pg.Client, release: () => Promise<any>) => {
            function onResult(err: Error, result: pg.Result<any> | any) {
                release()
                console.log('1')
                console.log(err, result)
                if (err) {
                    console.log('1 e')
                    reject(err)
                } else {
                    console.log('2')
                    if (single) {
                        console.log('3')
                        resolve(result.rows[0])
                    } else {
                        console.log('4')
                        resolve(result.rows)
                    }
                }
            }

            if (err) {
                console.log('2 1', err)
                release()
                reject(err)
            } else {
                console.log('2 2')
                if (values.length === 0) {
                    client.query(sql, onResult)
                } else {
                    client.query(sql, values, onResult)
                }
            }
        })
    })
}

export default Run
