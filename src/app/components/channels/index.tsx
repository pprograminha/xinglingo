'use client'
import { Button } from '@/components/ui/button'
import { useChannels } from '@/hooks/use-channels'
import { cn } from '@/lib/utils'
import { HtmlHTMLAttributes } from 'react'

type ChannelsProps = HtmlHTMLAttributes<HTMLUListElement>

export const Channels = ({ className, ...props }: ChannelsProps) => {
  const { channelIndex, onChannelIndex, groupConversationsPerDay } =
    useChannels()

  const channels = Array.from(
    { length: groupConversationsPerDay.length },
    (_, v) => v + 1,
  )

  if (channels.length === 0) return <div className="md:pr-4 pr-2" />

  return (
    <div
      className="bg-zinc-900 flex flex-col justify-between pb-2 md:pb-4 py-2 px-2"
      key="channel"
    >
      <ul className={cn('inline-flex flex-col gap-1 ', className)} {...props}>
        <div className="bg-zinc-600/15 py-2 flex flex-col gap-2 rounded-md overflow-y-auto overflow-x-hidden max-h-[calc(100vh_-_16px)] md:max-h-[calc(100vh_-_24px)]">
          {channels.map((channel, index) => (
            <li
              key={channel}
              data-selected={channelIndex === index}
              className="group"
            >
              <Button
                onClick={() => onChannelIndex(index)}
                className="
                  inline-flex
                  items-center
                  gap-2
                  text-sm
                  font-medium
                  bg-transparent
                  dark:bg-transparent
                  dark:text-white
                  ring-offset-white
                  transition-colors
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-zinc-950
                  focus-visible:ring-offset-2
                  dark:ring-offset-zinc-950
                  dark:focus-visible:ring-zinc-300
                  dark:hover:text-zinc-50
                  rounded-full
                  w-14
                  h-14
                  hover:bg-zinc-800
                  dark:hover:bg-green-700/10
                  hover:text-white
                  group-data-[selected=true]:bg-white
                  group-data-[selected=true]:text-black
                  group-data-[selected=true]:dark:bg-green-700/20
                  group-data-[selected=true]:dark:text-green-300"
              >
                <span className="text-sm inline font-bold">{channel}</span>
              </Button>
            </li>
          ))}
        </div>
      </ul>
    </div>
  )
}
