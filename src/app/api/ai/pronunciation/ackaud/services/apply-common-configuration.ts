import * as SpeechSDK from 'microsoft-cognitiveservices-speech-sdk'

export const applyCommonConfigurationTo = (
  recognizer: SpeechSDK.SpeechRecognizer,
) => {
  // The 'recognizing' event signals that an intermediate recognition result is received.
  // Intermediate results arrive while audio is being processed and represent the current "best guess" about
  // what's been spoken so far.
  recognizer.recognizing = () => {}

  // The 'recognized' event signals that a finalized recognition result has been received. These results are
  // formed across complete utterance audio (with either silence or eof at the end) and will include
  // punctuation, capitalization, and potentially other extra details.
  //
  // * In the case of continuous scenarios, these final results will be generated after each segment of audio
  //   with sufficient silence at the end.
  // * In the case of intent scenarios, only these final results will contain intent JSON data.
  // * Single-shot scenarios can also use a continuation on recognizeOnceAsync calls to handle this without
  //   event registration.
  recognizer.recognized = () => {}

  // The 'canceled' event signals that the service has stopped processing speech.
  // https://docs.microsoft.com/javascript/api/microsoft-cognitiveservices-speech-sdk/speechrecognitioncanceledeventargs?view=azure-node-latest
  // This can happen for two broad classes of reasons:
  // 1. An error was encountered.
  //    In this case, the .errorDetails property will contain a textual representation of the error.
  // 2. No additional audio is available.
  //    This is caused by the input stream being closed or reaching the end of an audio file.
  recognizer.canceled = () => {}

  // The 'sessionStarted' event signals that audio has begun flowing and an interaction with the service has
  // started.
  recognizer.sessionStarted = () => {}

  // The 'sessionStopped' event signals that the current interaction with the speech service has ended and
  // audio has stopped flowing.
  recognizer.sessionStopped = () => {}
}
