"use client"
import { signIn } from "next-auth/react"
 
export  default function SignIn() {
  const resendAction = (formData: FormData) => {
    signIn("resend", formData)
  }
 
  return (
    <form action={resendAction}>
      <label htmlFor="email-resend">
        Email
        <input type="email" id="email-resend" name="email" />
      </label>
      <div>
      <input type="submit" value="Signin with Resend" />

      </div>
    </form>
  )
}