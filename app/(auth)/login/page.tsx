import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import React from 'react'
import Image from "next/image";
import GooogleIcon from "../../../public/google.svg"


export default function Login() {
  return (
    <div className="rounded-2xl bg-black/80 py-10 px-6">
      <form method="post" action="/api/auth/signin">
        <h1 className="text-3xl font-semibold text-white">Log in</h1>
        <div className="space-y-4 mt-5">
          <Input
            type="email"
            name="email"
            placeholder="Email"
            className="bg-[#333] placeholder:text-xs placeholder:text-gray-400 w-full inline-block"
          />
          <Button
            type="submit"
            variant="destructive"
            className="w-full bg-[#e50914]"
          >
            Log in
          </Button>
        </div>
      </form>

      <div className="text-gray-500 text-sm mt-2">
        New to Neflix?{" "}
        <Link className="text-white hover:underline" href="/sign-up">
          Sign up now!
        </Link>
      </div>
      <div className="flex w-full justify-center items-center gap-x-3 mt-6">
      <Button variant="outline">
      <Image src={GooogleIcon} alt="Google icon" className="w-6 h-6 mr-2" />
      Sign in with Google
      </Button>
      </div>
      </div>
  )
}
