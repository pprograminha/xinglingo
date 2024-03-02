import { toast } from '@/components/ui/use-toast'

type AudioRecorder = {
  audioBlobs: Blob[]
  mediaRecorder: MediaRecorder | null
  streamBeingCaptured: MediaStream | null
  start: () => Promise<void>
  stop: () => Promise<Blob>
  cancel: () => void
  stopStream: () => void
  resetRecordingProperties: () => void
}

const audioRecorder: AudioRecorder = {
  /** Stores the recorded audio as Blob objects of audio data as the recording continues */
  audioBlobs: [] /* of type Blob[] */,
  /** Stores the reference of the MediaRecorder instance that handles the MediaStream when recording starts */
  mediaRecorder: null /* of type MediaRecorder */,
  /** Stores the reference to the stream currently capturing the audio */
  streamBeingCaptured: null /* of type MediaStream */,
  /** Start recording the audio
   */
  start: () => {
    // Feature Detection
    if (!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) {
      // Feature is not supported in browser
      // return a custom error

      toast({
        title:
          'mediaDevices API or getUserMedia method is not supported in this browser.',
        variant: 'destructive',
      })

      return Promise.reject(
        new Error(
          'mediaDevices API or getUserMedia method is not supported in this browser.',
        ),
      )
    } else {
      // Feature is supported in browser

      // create an audio stream
      return (
        navigator.mediaDevices
          .getUserMedia({ audio: true } /* of type MediaStreamConstraints */)
          // returns a promise that resolves to the audio stream
          .then((stream) /* of type MediaStream */ => {
            // save the reference of the stream to be able to stop it when necessary
            audioRecorder.streamBeingCaptured = stream

            // create a media recorder instance by passing that stream into the MediaRecorder constructor
            audioRecorder.mediaRecorder = new MediaRecorder(
              stream,
            ) /* the MediaRecorder interface of the MediaStream Recording
                    API provides functionality to easily record media */

            // clear previously saved audio Blobs, if any
            audioRecorder.audioBlobs = []

            // add a dataavailable event listener in order to store the audio data Blobs when recording
            audioRecorder.mediaRecorder.addEventListener(
              'dataavailable',
              (event) => {
                // store audio Blob object
                audioRecorder.audioBlobs.push(event.data)
              },
            )

            // start the recording by calling the start method on the media recorder
            audioRecorder.mediaRecorder.start()
          })
      )

      /* errors are not handled in the API because if its handled and the promise is chained, the .then after the catch will be executed */
    }
  },
  /** Stop the started audio recording
   */
  stop: () => {
    // return a promise that would return the blob or URL of the recording
    return new Promise<Blob>((resolve) => {
      // save audio type to pass to set the Blob type
      const mimeType = audioRecorder.mediaRecorder?.mimeType

      // listen to the stop event in order to create & return a single Blob object
      audioRecorder.mediaRecorder?.addEventListener('stop', () => {
        // create a single blob object, as we might have gathered a few Blob objects that needs to be joined as one
        const audioBlob = new Blob(audioRecorder.audioBlobs, { type: mimeType })

        // resolve promise with the single audio blob representing the recorded audio
        resolve(audioBlob)
      })
      audioRecorder.cancel()
    })
  },
  /** Cancel audio recording */
  cancel: () => {
    // stop the recording feature
    audioRecorder.mediaRecorder?.stop()

    // stop all the tracks on the active stream in order to stop the stream
    audioRecorder.stopStream()

    // reset API properties for next recording
    audioRecorder.resetRecordingProperties()
  },
  /** Stop all the tracks on the active stream in order to stop the stream and remove
   * the red flashing dot showing in the tab
   */
  stopStream: () => {
    // stopping the capturing request by stopping all the tracks on the active stream
    audioRecorder.streamBeingCaptured
      ?.getTracks() // get all tracks from the stream
      .forEach((track) /* of type MediaStreamTrack */ => track.stop()) // stop each one
  },
  /** Reset all the recording properties including the media recorder and stream being captured */
  resetRecordingProperties: function () {
    audioRecorder.mediaRecorder = null
    audioRecorder.streamBeingCaptured = null

    /* No need to remove event listeners attached to mediaRecorder as
        If a DOM element which is removed is reference-free (no references pointing to it), the element itself is picked
        up by the garbage collector as well as any event handlers/listeners associated with it.
        getEventListeners(audioRecorder.mediaRecorder) will return an empty array of events. */
  },
}

export const useAudioRecorder = () => {
  return {
    stop: audioRecorder.stop,
    start: audioRecorder.start,
  }
}
