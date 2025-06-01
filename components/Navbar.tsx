"use client";
import Link from "next/link";
import { useAuth } from "context/AuthContext";


export default function Navbar() {
  const { user } = useAuth();
  const { logout } = useAuth();


  return (
    <nav className="bg-blue-600 text-white px-6 py-4 shadow-md">
      <div className="flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">SupportSpace</Link>
        <div className="space-x-4">
          <Link href="/" className="p-2 rounded-md transition-all delay-150 duration-300 ease-in-out hover:bg-indigo-500 hover:font-bold">Home</Link>
          <Link href="/about" className="p-2 rounded-md transition-all delay-150 duration-300 ease-in-out hover:bg-indigo-500 hover:font-bold">About</Link>
          <Link href="/feed" className="p-2 rounded-md transition-all delay-150 duration-300 ease-in-out hover:bg-indigo-500 hover:font-bold">Feed</Link>
          <Link href="/chat" className="p-2 rounded-md transition-all delay-150 duration-300 ease-in-out hover:bg-indigo-500 hover:font-bold">Chat</Link>
            {user && (
              // User Avatar Image or Popover Component
              // <UserAvatarPopover username={user.username} onChat={() => {}} onAddFriend={() => {}} />
              <Link href={`/profile/${user.id}`} className="p-2 rounded-md transition-all delay-150 duration-300 ease-in-out hover:bg-indigo-500 hover:font-bold">Profile</Link>
            )}
            {user && (
              <img
                src={user.avatar_url || "/default-avatar.png"}
                alt="User Avatar"
                className="w-8 h-8 rounded-full inline-block"
              />
              )}
          {user && (

            <button onClick={logout} >Logout</button>
            )}
          {!user && 
          <Link href="/auth/register" className="p-2 rounded-md transition-all delay-150 duration-300 ease-in-out hover:bg-indigo-500 hover:font-bold">Register</Link>}
          {!user &&
          <Link href="/auth/login" className="p-2 rounded-md transition-all delay-150 duration-300 ease-in-out hover:bg-indigo-500 hover:font-bold">Login</Link>}

          
        </div>
      </div>
    </nav>
  );
}
