// app/auth/reset-password/page.tsx
import { Suspense } from "react";
import EmailVerificationPage from "./VeriyEmil";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EmailVerificationPage />
    </Suspense>
  );
}