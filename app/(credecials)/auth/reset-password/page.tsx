// app/auth/reset-password/page.tsx
import { Suspense } from "react";
import ResetPassword from "./ResetPasswordComponent";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPassword />
    </Suspense>
  );
}