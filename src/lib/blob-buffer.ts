export async function blobToAudioBuffer(blob: Blob): Promise<AudioBuffer> {
  const audioContext = new AudioContext()

  return new Promise<AudioBuffer>((resolve, reject) => {
    const fileReader = new FileReader()

    fileReader.onload = () => {
      const arrayBuffer = fileReader.result as ArrayBuffer
      audioContext.decodeAudioData(
        arrayBuffer,
        (buffer: AudioBuffer) => {
          resolve(buffer)
        },
        (error) => {
          reject(error)
        },
      )
    }

    fileReader.onerror = (error) => {
      reject(error)
    }

    fileReader.readAsArrayBuffer(blob)
  })
}
