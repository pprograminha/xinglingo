type MakeDownloadData = {
  data: Blob | MediaSource
  filename: string
}

export const makeDownload = ({ data, filename }: MakeDownloadData) => {
  const blobUrl = window.URL.createObjectURL(data)

  const link = document.createElement('a')
  link.href = blobUrl
  link.download = filename

  document.body.appendChild(link)

  link.click()

  link.remove()
}
