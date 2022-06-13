import path from 'path'

const getContentType = (file: any) => {
    const extension = path.extname(file)
    switch (extension) {
        case '.jpg':
        case '.jpeg':
            return 'image/jpeg'
        case '.png':
            return 'image/png'
        case '.gif':
            return 'image/gif'
        case '.pdf':
            return 'application/pdf'
        case '.doc':
            return 'application/msword'
        case '.docx':
            return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        case '.xls':
            return 'application/vnd.ms-excel'
        case '.xlsx':
            return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        case '.ppt':
            return 'application/vnd.ms-powerpoint'
        case '.pptx':
            return 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
        default:
            return 'application/octet-stream'
    }
}


export default getContentType
