'use client'
import { cn } from '@/lib/utils'
import anime from 'animejs'
import React, { HtmlHTMLAttributes, useEffect, useRef } from 'react'

const CfFrame: React.FC<HtmlHTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => (
  <div
    className={cn(
      'w-[100px] h-[100px] absolute rounded-[1em] left-[100px] bottom-0 cf-flame',
      className,
    )}
    {...props}
  ></div>
)

export function Loading() {
  const fireContainerRef = useRef<HTMLDivElement | null>(null)
  const secondaryFireContainerRef = useRef<HTMLDivElement | null>(null)
  const baseFireRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const fireContainerChildNodes = fireContainerRef.current?.childNodes
    const secondaryFireContainerChildNodes =
      secondaryFireContainerRef.current?.childNodes

    const baseFireChildNodes = baseFireRef.current?.childNodes

    function animateBaseFire() {
      anime({
        targets: baseFireChildNodes,
        delay: anime.stagger(300),
        translateY: function () {
          return anime.random(0, -10)
        },
        keyframes: [
          { scale: 0.8 },
          { scale: 0.825 },
          { scale: 0.9 },
          { scale: 0.925 },
          { scale: 1 },
        ],
        duration: 300,
        easing: 'easeInOutSine',
        loop: true,
      })
    }

    function animateFlame1() {
      anime({
        targets: fireContainerChildNodes,
        delay: anime.stagger(100),
        translateY: function () {
          return anime.random(0, 300)
        },
        rotate: 30,
        opacity: function () {
          return anime.random(0.5, 1)
        },
        translateX: function () {
          return anime.random(0, -60)
        },
        scale: 0,
        skew: function () {
          return anime.random(0, 10)
        },
        loop: true,
        easing: 'easeInOutSine',
      })
    }

    function animateFlame2() {
      anime({
        targets: secondaryFireContainerChildNodes,
        delay: anime.stagger(400),

        translateY: function () {
          return anime.random(-260, -160)
        },
        translateX: function () {
          return anime.random(0, -30)
        },
        scale: 0,
        rotate: function () {
          return anime.random(0, 60)
        },
        skew: function () {
          return anime.random(0, 30)
        },
        loop: true,
        easing: 'easeInOutSine',
      })
    }

    function animateFlame3() {
      anime({
        targets: fireContainerChildNodes,
        delay: anime.stagger(500),
        translateY: function () {
          return anime.random(-300, -200)
        },
        opacity: function () {
          return anime.random(0, 1)
        },
        translateX: function () {
          return anime.random(-50, 50)
        },
        scale: 0,
        rotate: function () {
          return anime.random(0, -30)
        },
        skew: function () {
          return anime.random(0, 20)
        },
        loop: true,
        easing: 'easeInOutSine',
      })
    }

    if (secondaryFireContainerChildNodes) {
      animateFlame2()
    }

    if (fireContainerChildNodes) {
      animateFlame1()
      animateFlame3()
    }

    if (baseFireChildNodes) {
      animateBaseFire()
    }
  }, [])

  return (
    <div className="w-[300px] h-[300px] relative -translate-x-2/4 -translate-y-2/4 left-2/4 top-2/4">
      <div
        ref={fireContainerRef}
        className="w-[100px] h-[100px] absolute bottom-0"
        id="fireNodes1"
      >
        <CfFrame className="bg-yellow-200" />
        <CfFrame className="bg-yellow-300" />
        <CfFrame className="bg-yellow-400" />
        <CfFrame className="bg-yellow-600" />
        <CfFrame className="bg-orange-500" />
        <CfFrame className="bg-orange-600" />
        <CfFrame className="bg-orange-700" />
      </div>
      <div
        ref={secondaryFireContainerRef}
        className="w-[150px] h-[150px] absolute bottom-0"
        id="fireNodes2"
      >
        <CfFrame className="bg-yellow-200" />
        <CfFrame className="bg-yellow-300" />
        <CfFrame className="bg-yellow-400" />
        <CfFrame className="bg-yellow-600" />
        <CfFrame className="bg-orange-500" />
        <CfFrame className="bg-orange-600" />
        <CfFrame className="bg-orange-700" />
      </div>
      <div
        ref={baseFireRef}
        className="w-[100px] h-[100px] absolute bottom-0"
        id="base-fire"
      >
        <CfFrame className="bg-orange-700 opacity-95" />
        <CfFrame className="bg-orange-600 w-[100px] h-[100px] opacity-[0.85] left-[75px]" />
        <CfFrame className="bg-orange-500 w-[60px] h-[60px] opacity-[0.85] left-[130px]" />
      </div>
      <div className="w-3/5 h-[100px] absolute left-[50px] bottom-0">
        <div className="h-[30px] origin-center absolute shadow-lg w-full rounded-[0.5em] bottom-0 bg-amber-900 rotate-[15deg]"></div>
        <div className="h-[30px] origin-center absolute shadow-lg w-full rounded-[0.5em] bottom-0 bg-amber-900 rotate-[-15deg]"></div>
      </div>
    </div>
  )
}
