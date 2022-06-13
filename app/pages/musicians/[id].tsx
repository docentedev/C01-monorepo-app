import { useState } from 'react'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Button from '@mui/material/Button'
import DeleteForever from '@mui/icons-material/DeleteForever'
import { useRouter } from 'next/router'
import BreadcrumbsSite from '../../components/BreadcrumbsSite'
import makeBaseurl from '../../utils/makeBaseurl'
import MusicianForm from '../../components/MusicianForm'

const uploadFileWithIdRequest = (id: string, file: any) => {
  const form = new FormData()
  form.append('file', file)
  form.append('id', id)

  fetch('/api/musicians/upload/file', {
    method: 'POST',
    body: form
  })
    .then(response => {
      console.log(response)
    })
    .catch(err => {
      console.error(err)
    })
}

const UploadForm = ({ id: initialId }: { id: string }) => {
  const [file, setFile] = useState(null)
  const [id, setId] = useState(initialId)

  const handleFileChange = (e) => {
    setFile(e.target.files[0])
  }

  const handleIdChange = (e) => {
    setId(e.target.value)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (file && id) {
      uploadFileWithIdRequest(id, file)
    } else {
      console.log('no file or id')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" onChange={handleFileChange} />
      <input type="text" onChange={handleIdChange} value={id} />
      <button type="submit">Submit</button>
    </form>
  )
}

const Musician = ({ initialData }: any) => {
  const [openSuccess, setOpenSuccess] = useState(false)
  const [data, setData] = useState(initialData)
  const router = useRouter()

  const handlerSave = async () => {
    const response = await fetch(`/api/musicians/${data.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    const json = await response.json()
    console.log(json)
    if (response.status === 200) {
      setOpenSuccess(true)
      setTimeout(() => {
        setOpenSuccess(false)
        // redirect to list
        router.push('/musicians')
      }, 3000)
    }
  }

  const handlerDelete = async () => {
    const response = await fetch(`/api/musicians/${data.id}`, { method: 'DELETE' })
    const json = await response.json()
    console.log(json)
    if (response.status === 200) {
      setOpenSuccess(true)
      setTimeout(() => {
        setOpenSuccess(false)
        // redirect to list
        router.push('/musicians')
      }, 3000)
    }
  }

  return data
    ? (
      <div>
        <BreadcrumbsSite urls={[
          { text: 'Home', url: '/' },
          { text: 'Musicians', url: '/musicians' },
          { text: data.id, url: '/musicians' }
        ]} />
        <Grid>
          <Grid item xs={12}>
            <Card style={{ marginBottom: 10 }}>
              <CardHeader
                title="Musicians"
                action={
                  <Button
                    variant="contained"
                    color="error"
                    startIcon={<DeleteForever />}
                    onClick={handlerDelete}
                  >
                    Delete
                  </Button>}
              />
              <CardContent>
                <MusicianForm
                  data={data}
                  onSave={handlerSave}
                  setData={setData}
                  openSuccess={openSuccess}
                  setOpenSuccess={setOpenSuccess}
                />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Paper style={{ padding: 10 }}>
              <pre>{JSON.stringify(data, null, 2)}</pre>
            </Paper>
          </Grid>
        </Grid>
        <UploadForm id={data.id} />
      </div>
      )
    : (
      <div>Loading...</div>
      )
}

export async function getServerSideProps ({ query, req }: any) {
  try {
    const baseUrl = makeBaseurl(req)
    const id = query.id
    const res = await fetch(`${baseUrl}/api/musicians/${id}`)
    const json = await res.json()
    return { props: { initialData: json } }
  } catch (error) {
    return { props: { initialData: null, error } }
  }
}

export default Musician
