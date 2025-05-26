"use client";

import { handleSignIn } from "@/app/lib/actions";

export default function SignIn() {
  return (
    <button
      type="button"
      className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
      onClick={handleSignIn}
    >
      <img
        src="https://www.google.com/favicon.ico"
        alt="Google Logo"
        className="w-5 h-5 mr-2"
      />
      Sign in with Google
    </button>
  );
}