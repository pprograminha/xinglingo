'use client'
import { LogOut } from '@/components/logout'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { Link, usePathname } from '@/navigation'
import { CircleUser, CreditCard } from 'lucide-react'
import { HtmlHTMLAttributes } from 'react'

type SideBarProps = HtmlHTMLAttributes<HTMLUListElement>

export const SideBar = ({ className, ...props }: SideBarProps) => {
  const pathname = usePathname()
  const items = [
    {
      href: '/profile',
      icon: <CircleUser />,
      label: 'Perfil',
    },
    {
      href: '/profile/plans',
      icon: <CreditCard />,
      label: 'Planos',
    },
  ]

  return (
    <ul
      className={cn(
        'inline-flex  fixed bottom-4 right-6 left-4 md:bottom-auto md:right-auto md:left-auto md:relative z-50 flex-col  md:min-h-full gap-1',
        className,
      )}
      {...props}
    >
      <div className="bg-gradient-to-t from-zinc-900 md:from-zinc-800 via-zinc-900 to-zinc-900 border h-full dark:border-zinc-800 rounded-xl">
        <div className="flex md:flex-col gap-2 p-1 sm:p-2 h-full rounded-xl bg-[url('/assets/svgs/bg.svg')] bg-[length:200px_137px]">
          {items.map((item) => (
            <li
              key={item.href}
              data-selected={item.href === pathname}
              className="group"
            >
              <TooltipProvider>
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <Link
                      href={item.href}
                      className="
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
                    dark:bg-zinc-800
                    border
                    border-zinc-800
                    dark:hover:border-green-300
                    hover:text-white
                    group-data-[selected=true]:text-black
                    group-data-[selected=true]:border-green-300/20
                    group-data-[selected=true]:dark:text-emerald-400"
                    >
                      <span className="inline-flex items-center justify-center [&>svg]:h-4 [&>svg]:w-4 text-lg text-zinc-500 group-hover:text-zinc-400 group-data-[selected=true]:dark:text-emerald-400">
                        {item.icon}
                      </span>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <span>{item.label}</span>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </li>
          ))}
          <TooltipProvider>
            <Tooltip delayDuration={0}>
              <TooltipTrigger
                className="
                    mt-auto
              "
                asChild
              >
                <LogOut
                  className="
                    first-of-type:inline-flex
                    first-of-type:items-center
                    first-of-type:justify-center
                    first-of-type:[&>svg]:h-4
                    first-of-type:[&>svg]:w-4
                    first-of-type:text-lg
                    first-of-type:text-zinc-500
                    first-of-type:group-hover:text-zinc-400
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
                    dark:hover:border-green-300
                    hover:text-white
                    group-data-[selected=true]:text-black
                    group-data-[selected=true]:border-green-300/20
                    group-data-[selected=true]:dark:text-emerald-400"
                />
              </TooltipTrigger>
              <TooltipContent side="right">
                <span>Sair</span>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </ul>
  )
}
