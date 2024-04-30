'use client'
import { Button } from '@/components/ui/button'
import { env } from '@/env'
import { lingos } from '@/lib/storage/local'
import { Howl } from 'howler'
import { memo, useCallback, useEffect, useMemo, useState } from 'react'

const BackgroundSoundPrimitive = () => {
  const isSoundOff = lingos.storage.get('sound') === 'off'

  const [isSoundPlaying, setIsSoundPlaying] = useState(!isSoundOff)

  const sound = useMemo(() => {
    const sound = new Howl({
      src: `${env.NEXT_PUBLIC_APP_URL}/assets/steps.mp4`,
      volume: 0.01,
      loop: true,
    })

    return sound
  }, [])

  const soundPlayHandler = useCallback(() => {
    sound.play()

    lingos.storage.set('sound', 'on')

    setIsSoundPlaying(true)
  }, [sound])

  const soundStopHandler = useCallback(() => {
    sound.stop()

    lingos.storage.set('sound', 'off')

    setIsSoundPlaying(false)
  }, [sound])

  useEffect(() => {
    if (!isSoundOff) soundPlayHandler()

    return () => {
      soundStopHandler()
    }
  }, [isSoundOff, soundPlayHandler, soundStopHandler])

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="absolute group z-20 items-end !cursor-pointer gap-1 overflow-hidden top-4 right-4"
        data-off={!isSoundPlaying}
        onClick={() => {
          if (!isSoundPlaying) soundPlayHandler()
          else soundStopHandler()
        }}
      >
        <div className="pointer-events-none w-4 h-[20%] group-data-[off=true]:bg-zinc-500 bg-[#4ade80] rounded-t-md group-data-[off=false]:animate-music-bar group-data-[off=false]:delay-500" />
        <div className="pointer-events-none w-4 h-[40%] group-data-[off=true]:bg-zinc-500 bg-[#34d399] rounded-t-md group-data-[off=false]:animate-music-bar group-data-[off=false]:delay-200" />
        <div className="pointer-events-none w-4 h-[60%] group-data-[off=true]:bg-zinc-500 bg-[#10b981] rounded-t-md group-data-[off=false]:animate-music-bar" />
        <div className="pointer-events-none w-4 h-[30%] group-data-[off=true]:bg-zinc-500 bg-[#22d3ee] rounded-t-md group-data-[off=false]:animate-music-bar group-data-[off=false]:delay-700" />
      </Button>
    </>
  )
}

export const BackgroundSound = memo(BackgroundSoundPrimitive)
