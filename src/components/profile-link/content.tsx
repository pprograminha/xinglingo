import { getWordsList } from '@/actions/conversations/get-words-list'
import { getAuth } from '@/lib/auth/get-auth'
import { SparkleIcon } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { ProfileLinkSkeleton } from './skeleton'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip'

export const ProfileLinkContent = async () => {
  const { user } = await getAuth()
  const t = await getTranslations()
  const {
    green: { words },
    count: { wordsToLearn, wordsRemaining },
  } = await getWordsList()

  if (!user) return <ProfileLinkSkeleton />

  return (
    <>
      <div className="flex gap-2 items-center">
        <Avatar>
          <AvatarFallback>{user.fullName[0]}</AvatarFallback>
          <AvatarImage src={user.image || undefined} />
        </Avatar>

        <div className="flex gap-2 items-center">
          <span>{user.fullName}</span>
          <SparkleIcon className="w-5 text-yellow-400" />
        </div>
      </div>
      <div className="text-xs mt-2">
        <h1>
          {t('You are {value}% closer to becoming fluent', {
            value: ((words.length / wordsToLearn) * 100).toFixed(2),
          })}
        </h1>
        <TooltipProvider>
          <Tooltip delayDuration={0}>
            <TooltipTrigger>
              <div className="p-2 border border-yellow-200 inline-block rounded-md mt-2 whitespace-nowrap">
                <span className="text-yellow-400">{wordsToLearn}</span> /{' '}
                <span className="text-yellow-400">{words.length}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                {t.rich(
                  'Your goal is to learn {words} words, {wordsRemaining} words remaining',
                  {
                    words: wordsToLearn,
                    wordsRemaining,
                    questionHelp: () => null,
                  },
                )}
                <br />
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </>
  )
}
