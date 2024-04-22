/* eslint-disable @typescript-eslint/no-explicit-any */

import { Button } from '@/components/ui/button'

const Plans = () => {
  return (
    <div className="p-2 md:p-4 w-full">
      <div className="px-6 py-20 md:px-12 lg:px-20 h-full dark:bg-zinc-950 w-full border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-y-auto">
        <div className="m-auto text-center lg:w-7/12">
          <h2 className="text-2xl font-bold text-zinc-800 dark:text-white md:text-4xl">
            A Lingo AI subscription gives you access to our components and more.
          </h2>
        </div>
        <div className="mt-12 grid items-center gap-6 md:grid-cols-2 lg:flex lg:space-x-8">
          <div className="group relative md:col-span-1 lg:w-[32%]">
            <div
              aria-hidden="true"
              className="absolute top-0 h-full w-full rounded-3xl border border-zinc-100 dark:border-zinc-700 bg-zinc-800 dark:bg-zinc-800 shadow-2xl shadow-zinc-600/10 dark:shadow-none transition duration-500 group-hover:scale-105 lg:group-hover:scale-110"
            />
            <div className="relative space-y-8 p-8">
              <h3 className="text-center text-3xl font-semibold text-zinc-700 dark:text-white">
                Monthly
              </h3>
              <div className="relative flex justify-around">
                <div className="flex">
                  <span className="-ml-6 mt-2 text-3xl font-bold text-primary">
                    $
                  </span>
                  <span className="leading-0 text-8xl font-bold text-zinc-800 dark:text-white">
                    19
                  </span>
                </div>
                <span className="absolute right-9 bottom-2 text-xl font-bold text-primary">
                  / Month
                </span>
              </div>
              <ul
                role="list"
                className="m-auto w-max space-y-4 pb-6 text-zinc-600 dark:text-zinc-300"
              >
                <li className="space-x-2">
                  <span className="font-semibold text-primary">✓</span>
                  <span>First premium advantage</span>
                </li>
                <li className="space-x-2">
                  <span className="font-semibold text-primary">✓</span>
                  <span>Second premium advantage</span>
                </li>
                <li className="space-x-2">
                  <span className="font-semibold text-primary">✓</span>
                  <span>Third advantage</span>
                </li>
              </ul>
              <button className="relative flex h-11 w-full items-center justify-center px-6 before:absolute before:inset-0 before:rounded-full before:bg-primary before:transition before:duration-300 hover:before:scale-105 active:duration-75 active:before:scale-95">
                <span className="relative text-base font-semibold text-white dark:text-dark">
                  Start plan
                </span>
              </button>
            </div>
          </div>
          <div className="group relative row-start-1 md:col-span-2 lg:w-[36%]">
            <div
              aria-hidden="true"
              className="absolute top-0 h-full w-full rounded-3xl border border-zinc-100 dark:border-zinc-700 bg-zinc-800 dark:bg-zinc-800 shadow-2xl shadow-zinc-600/10 dark:shadow-none transition duration-500 group-hover:scale-105 lg:group-hover:scale-110"
            />
            <div className="relative space-y-8 p-8">
              <h3 className="text-center text-3xl font-semibold text-zinc-700 dark:text-white">
                Annual
              </h3>
              <div className="overflow-hidden">
                <div className="-mr-20 flex items-end justify-center">
                  <div className="flex">
                    <span className="-ml-6 mt-2 text-3xl font-bold text-primary">
                      $
                    </span>
                    <span className="leading-0 text-8xl font-bold text-zinc-800 dark:text-white">
                      15
                    </span>
                  </div>
                  <div className="mb-2">
                    <span className="block text-xl font-bold text-zinc-500 dark:text-zinc-400">
                      .56
                    </span>
                    <span className="block text-xl font-bold text-primary">
                      / Month
                    </span>
                  </div>
                </div>
                <div className="text-center text-2xl font-medium">
                  <span className="text-zinc-400 line-through">$234</span>
                  <span className="font-semibold text-zinc-700 dark:text-white">
                    $190
                  </span>
                </div>
                <span className="block text-center text-xs uppercase text-primary">
                  BILLED YEARLY
                </span>
                <span className="m-auto mt-4 block w-max rounded-full bg-gradient-to-r from-yellow-300 to-pink-300 px-4 py-1 text-sm font-medium text-yellow-900">
                  1 Discount applied
                </span>
              </div>
              <ul
                role="list"
                className="m-auto w-max space-y-4 pb-6 text-zinc-600 dark:text-zinc-300"
              >
                <li className="space-x-2">
                  <span className="font-semibold text-primary">✓</span>
                  <span>First premium advantage</span>
                </li>
                <li className="space-x-2">
                  <span className="font-semibold text-primary">✓</span>
                  <span>Second premium advantage</span>
                </li>
                <li className="space-x-2">
                  <span className="font-semibold text-primary">✓</span>
                  <span>Third advantage</span>
                </li>
                <li className="space-x-2">
                  <span className="font-semibold text-primary">✓</span>
                  <span>Fourth organizations advantage</span>
                </li>
              </ul>
              <button className="relative flex h-11 w-full items-center justify-center px-6 before:absolute before:inset-0 before:rounded-full before:bg-primary before:transition before:duration-300 hover:before:scale-105 active:duration-75 active:before:scale-95">
                <span className="relative text-base font-semibold text-white dark:text-dark">
                  Start plan
                </span>
              </button>
            </div>
          </div>
          <div className="group relative md:col-span-1 lg:w-[32%]">
            <div
              aria-hidden="true"
              className="absolute top-0 h-full w-full rounded-3xl border border-zinc-100 dark:border-zinc-700 bg-zinc-800 dark:bg-zinc-800 shadow-2xl shadow-zinc-600/10 dark:shadow-none transition duration-500 group-hover:scale-105 lg:group-hover:scale-110"
            />
            <div className="relative space-y-8 p-8">
              <h3 className="text-center text-3xl font-semibold text-zinc-700 dark:text-white">
                Free
              </h3>
              <div className="relative flex justify-around">
                <div className="flex">
                  <span className="-ml-2 mt-2 text-3xl font-bold text-primary">
                    $
                  </span>
                  <span className="leading-0 text-8xl font-bold text-zinc-800 dark:text-white">
                    0
                  </span>
                </div>
              </div>
              <ul
                role="list"
                className="m-auto w-max space-y-4 pb-6 text-zinc-600 dark:text-zinc-300"
              >
                <li className="space-x-2">
                  <span className="font-semibold text-primary">✓</span>
                  <span>First premium advantage</span>
                </li>
                <li className="space-x-2">
                  <span className="font-semibold text-primary">✓</span>
                  <span>Second premium advantage</span>
                </li>
                <li className="space-x-2">
                  <span className="font-semibold text-primary">✓</span>
                  <span>Third advantage</span>
                </li>
              </ul>
              <button className="relative flex h-11 w-full items-center justify-center px-6 before:absolute before:inset-0 before:rounded-full before:bg-sky-50 before:border before:border-sky-500 dark:before:border-zinc-600 dark:before:bg-zinc-700 before:transition before:duration-300 hover:before:scale-105 active:duration-75 active:before:scale-95">
                <span className="relative text-base font-semibold text-sky-600 dark:text-white">
                  Get Started
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <section className="min-h-screen w-full py-12 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-zinc-900 dark:to-zinc-800 flex items-center justify-center">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 gap-6 mt-8 md:grid-cols-3 md:gap-8">
            <div className="flex flex-col p-6 bg-zinc-800 shadow-lg rounded-lg dark:bg-zinc-850 justify-between border border-gray-300">
              <div>
                <h3 className="text-2xl font-bold text-center">Basic</h3>
                <div className="mt-4 text-center text-zinc-600 dark:text-zinc-400">
                  <span className="text-4xl font-bold">$29</span>/ month
                </div>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-center">
                    <CheckIcon className="text-white text-xs bg-green-500 rounded-full mr-2 p-1" />
                    720p Video Rendering
                  </li>
                  <li className="flex items-center">
                    <CheckIcon className="text-white text-xs bg-green-500 rounded-full mr-2 p-1" />
                    2GB Cloud Storage
                  </li>
                  <li className="flex items-center">
                    <CheckIcon className="text-white text-xs bg-green-500 rounded-full mr-2 p-1" />
                    Basic Video Templates
                  </li>
                </ul>
              </div>
              <div className="mt-6">
                <Button className="w-full">Get Started</Button>
              </div>
            </div>
            <div className="relative flex flex-col p-6 bg-zinc-800 shadow-lg rounded-lg dark:bg-zinc-850 justify-between border border-purple-500">
              <div className="px-3 py-1 text-sm text-white bg-gradient-to-r from-pink-500 to-purple-500 rounded-full inline-block absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                Popular
              </div>
              <div>
                <h3 className="text-2xl font-bold text-center">Pro</h3>
                <div className="mt-4 text-center text-zinc-600 dark:text-zinc-400">
                  <span className="text-4xl font-bold">$59</span>/ month
                </div>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-center">
                    <CheckIcon className="text-white text-2xs bg-green-500 rounded-full mr-2 p-1" />
                    1080p Video Rendering
                  </li>
                  <li className="flex items-center">
                    <CheckIcon className="text-white text-xs bg-green-500 rounded-full mr-2 p-1" />
                    10GB Cloud Storage
                  </li>
                  <li className="flex items-center">
                    <CheckIcon className="text-white text-xs bg-green-500 rounded-full mr-2 p-1" />
                    Premium Video Templates
                  </li>
                  <li className="flex items-center">
                    <CheckIcon className="text-white text-xs bg-green-500 rounded-full mr-2 p-1" />
                    Collaboration Tools
                  </li>
                </ul>
              </div>
              <div className="mt-6">
                <Button className="w-full bg-gradient-to-r from-pink-500 to-purple-500">
                  Get Started
                </Button>
              </div>
            </div>
            <div className="flex flex-col p-6 bg-zinc-800 shadow-lg rounded-lg dark:bg-zinc-850 justify-between border border-gray-300">
              <div>
                <h3 className="text-2xl font-bold text-center">Enterprise</h3>
                <div className="mt-4 text-center text-zinc-600 dark:text-zinc-400">
                  <span className="text-4xl font-bold">$99</span>/ month
                </div>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-center">
                    <CheckIcon className="text-white text-xs bg-green-500 rounded-full mr-2 p-1" />
                    4K Video Rendering
                  </li>
                  <li className="flex items-center">
                    <CheckIcon className="text-white text-xs bg-green-500 rounded-full mr-2 p-1" />
                    Unlimited Cloud Storage
                  </li>
                  <li className="flex items-center">
                    <CheckIcon className="text-white text-xs bg-green-500 rounded-full mr-2 p-1" />
                    Custom Video Templates
                  </li>
                  <li className="flex items-center">
                    <CheckIcon className="text-white text-xs bg-green-500 rounded-full mr-2 p-1" />
                    Advanced Collaboration Tools
                  </li>
                  <li className="flex items-center">
                    <CheckIcon className="text-white text-xs bg-green-500 rounded-full mr-2 p-1" />
                    Dedicated Support
                  </li>
                </ul>
              </div>
              <div className="mt-6">
                <Button className="w-full">Get Started</Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
function CheckIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}
export default Plans
