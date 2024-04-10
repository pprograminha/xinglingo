'use client'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { CircleUser, CreditCard, LayoutPanelLeft } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { HtmlHTMLAttributes } from 'react'

type SideBarProps = HtmlHTMLAttributes<HTMLUListElement>

export const SideBar = ({ className, ...props }: SideBarProps) => {
  const pathname = usePathname()
  const items = [
    {
      href: '/',
      icon: <LayoutPanelLeft />,
      label: 'Home',
    },
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
      className={cn('inline-flex flex-col gap-1 pl-2 py-4', className)}
      {...props}
    >
      <div className="lg:bg-zinc-600/15 py-2 flex flex-col gap-2 rounded-md">
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
                    lg:justify-center
                    gap-2
                    lg:rounded-full
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
                    lg:h-14
                    lg:p-0
                    py-2
                    px-2
                    rounded-md
                    w-full
                    lg:w-14
                    lg:dark:bg-zinc-800
                    hover:bg-zinc-800
                    dark:hover:bg-zinc-700
                    hover:text-white
                    group-data-[selected=true]:bg-white
                    group-data-[selected=true]:text-black
                    group-data-[selected=true]:dark:bg-zinc-700
                    group-data-[selected=true]:dark:text-emerald-400"
                  >
                    <span className="inline-flex items-center justify-center [&>svg]:h-6 [&>svg]:w-6 text-lg text-zinc-500 group-hover:text-zinc-400 group-data-[selected=true]:dark:text-emerald-400">
                      {item.icon}
                    </span>
                    <span className="text-sm font-medium inline lg:hidden">
                      {item.label}
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
      </div>
    </ul>
  )
}
