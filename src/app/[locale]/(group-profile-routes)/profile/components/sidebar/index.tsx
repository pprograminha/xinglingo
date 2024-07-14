'use client'
import { getModels } from '@/actions/models/get-models'
import { LogOut } from '@/components/logout'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useAuth } from '@/hooks/use-auth'
import { retrieveActiveSubscription } from '@/lib/subscription'
import { cn } from '@/lib/utils'
import { Link, usePathname } from '@/navigation'
import { LanguagesIcon, LayoutDashboardIcon, WalletIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { HtmlHTMLAttributes, useEffect, useState } from 'react'

type SideBarProps = HtmlHTMLAttributes<HTMLUListElement>

type List = {
  hasAccess: boolean
  href: string
  label: string
  icon?: JSX.Element
  img?: string
  className?: string
}

export const SideBar = ({ className, ...props }: SideBarProps) => {
  const pathname = usePathname()
  const t = useTranslations()
  const { user } = useAuth()
  const [histories, setHistories] = useState<
    Awaited<ReturnType<typeof getModels>>['histories']
  >([])

  const items: List[] = [
    {
      hasAccess: true,
      href: '/profile',
      icon: <LayoutDashboardIcon />,
      label: t('Profile'),
      className: undefined,
    },
    {
      hasAccess: true,
      href: '/subscriptions',
      icon: <WalletIcon />,
      label: t('Plans'),
      className: undefined,
    },
    {
      hasAccess: Boolean(retrieveActiveSubscription(user)),
      href: '/languages',
      icon: <LanguagesIcon />,
      label: retrieveActiveSubscription(user)
        ? t('Languages')
        : t('Access not permitted'),
      className: 'md:mb-5',
    },

    ...histories.map((h) => ({
      hasAccess: Boolean(retrieveActiveSubscription(user)),
      href: `/models/${h.slug}`,
      icon: undefined,
      img: `/assets/imgs/${h.image}`,
      className: 'dark:aria-disabled:!border-red-500',
      label: retrieveActiveSubscription(user)
        ? h.name!
        : t('Access not permitted'),
    })),
  ]

  useEffect(() => {
    getModels(user).then((response) => setHistories(response.histories))
  }, [user])

  return (
    <ul
      className={cn(
        'inline-flex  fixed bottom-4 right-6 left-4 md:bottom-auto md:right-auto md:left-auto md:relative z-50 flex-col  md:min-h-full gap-1',
        className,
      )}
      {...props}
    >
      <div className="bg-gradient-to-t from-zinc-900 md:from-zinc-800 via-zinc-900 to-zinc-900 border h-full dark:border-zinc-800 rounded-xl  ">
        <div className="flex md:flex-col gap-2  h-full rounded-xl bg-[url('/assets/svgs/bg.svg')] bg-[length:200px_137px] pr-24 p-1 sm:p-2 md:pr-2 overflow-x-auto">
          {items.map((item, i) => (
            <li
              key={i}
              data-selected={item.href === pathname}
              className="group"
            >
              <TooltipProvider>
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <Link
                      href={item.hasAccess ? item.href : '#'}
                      aria-disabled={!item.hasAccess}
                      className={cn(
                        `
                        inline-flex
                        items-center
                        justify-center
                        gap-2
                        dark:aria-disabled:border-zinc-800
                        dark:aria-disabled:text-red-500
                        text-sm
                        font-medium
                        ring-offset-white
                        transition-colors
                        focus-visible:outline-none
                        focus-visible:ring-2
                        focus-visible:ring-zinc-950
                        focus-visible:ring-offset-2
                        dark:ring-offset-zinc-950
                        dark:focus-visible:ring-zinc-300
                        dark:hover:text-zinc-50
                        sm:h-14
                        h-12
                        w-12
                        sm:w-14
                        lg:p-0
                        md:p-2
                        rounded-xl
                        dark:bg-zinc-800
                        border
                        border-zinc-800
                        dark:hover:border-green-300
                        text-zinc-500
                        group-hover:text-zinc-400
                        hover:text-white
                        group-data-[selected=true]:text-black
                        group-data-[selected=true]:border-green-300/20
                        group-data-[selected=true]:dark:text-emerald-400`,
                        item.className,
                      )}
                    >
                      {item.img && (
                        <Image
                          src={item.img}
                          width={50}
                          height={33.6}
                          alt="Petutor"
                        />
                      )}
                      {item.icon && (
                        <span className="inline-flex items-center justify-center [&>svg]:h-4 [&>svg]:w-4 text-lg ">
                          {item.icon}
                        </span>
                      )}
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <span>{item.label}</span>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </li>
          ))}

          <LogOut
            className="
              mt-auto
              shrink-0
              first-of-type:inline-flex
              first-of-type:items-center
              first-of-type:justify-center
              first-of-type:[&>svg]:h-4
              first-of-type:[&>svg]:w-4
              first-of-type:text-lg
              inline-flex
              items-center
              justify-center
              gap-2
              text-sm
              font-medium
              ring-offset-white
              transition-colors
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-zinc-950
              focus-visible:ring-offset-2
              dark:ring-offset-zinc-950
              dark:focus-visible:ring-zinc-300
              dark:hover:text-zinc-50
              sm:h-14
              h-12
              w-12
              sm:w-14
              lg:p-0
              md:p-2
              rounded-xl
              dark:bg-zinc-900
              border
              border-zinc-800
              dark:hover:border-zinc-700
              hover:text-white
              dark:hover:bg-zinc-900
              group-data-[selected=true]:text-black
            "
          />
        </div>
      </div>
    </ul>
  )
}
