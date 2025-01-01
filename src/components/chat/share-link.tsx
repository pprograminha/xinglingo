'use client'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard'
import { openSansFont } from '@/lib/font/google/open-sans-font'
import { pixelatedFont } from '@/lib/font/google/pixelated-font'
import { CheckIcon, CopyIcon, ShareIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'

export function ShareLink() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          size="icon"
          variant="outline"
          className="rounded-full shrink-0 text-zinc-500"
        >
          <ShareIcon className="w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <ShareLinkContent />
      </PopoverContent>
    </Popover>
  )
}

export function ShareLinkContent() {
  const { isCopied, copyToClipboard } = useCopyToClipboard()
  const t = useTranslations()

  return (
    <div className={`${openSansFont.className}`}>
      <div className="pb-3">
        <h1 className={`${pixelatedFont.className} text-xl`}>
          {t('Share this model')}
        </h1>
        <p className="text-zinc-400 text-xs">
          {t(
            'Anyone with the link, if they have permission, can view this model',
          )}
        </p>
      </div>
      <div>
        <div className="flex space-x-2">
          <Input id="link" value={window.location.href} readOnly />
          <Tooltip open={isCopied}>
            <TooltipTrigger asChild>
              <Button
                disabled={isCopied}
                className="shrink-0"
                size="icon"
                onClick={() => copyToClipboard(window.location.href)}
              >
                {isCopied ? (
                  <CheckIcon className="w-3" />
                ) : (
                  <CopyIcon className="w-3" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t('Copied successfully')}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  )
}
