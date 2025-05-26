// app/403/page.tsx
export const metadata = {
    title: "Access Denied – 403",
  };
  
  export default function AccessDenied() {
    return (
      <div className="flex h-screen items-center justify-center px-4 text-center">
        <div>
          <h1 className="text-5xl font-bold text-red-600">403</h1>
          <p className="mt-4 text-lg text-gray-700">
            You do not have permission to access this page.
          </p>
        </div>
      </div>
    );
  }
  