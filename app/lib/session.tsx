import { getSessionUser } from "@/app/lib/actions"; // Import the function

export default async function DashboardPage() {
  const user = await getSessionUser(); // Fetch user session

  if (!user) {
    return <p>Please sign in to access this page.</p>;
  }

  return (
    <div>
      <h1>Welcome, {user.name}!</h1>
      <p>Email: {user.email}</p>
      {/* <img src={user.image} alt="Profile" width={50} height={50} /> */}
    </div>
  );
}
