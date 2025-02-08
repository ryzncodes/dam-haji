'use client'

import { SignInForm } from '@/components/auth/sign-in-form'

export default function LoginPage() {
  return (
    <div className="container relative flex h-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome to Dam Haji
          </h1>
          <p className="text-sm text-muted-foreground">
            Sign in to save your progress and compete with others
          </p>
        </div>
        <SignInForm />
      </div>
    </div>
  )
} 