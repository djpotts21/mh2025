export default function UserAvatarPopover({
  userId,
  children,
}: {
  userId: number;
  children: React.ReactNode;
}) {
  return (
    <div className="relative group cursor-pointer">
      {children}
      {/* Replace this with actual popover logic */}
      <div className="hidden group-hover:block absolute z-10 top-10 left-0 p-2 bg-white border rounded shadow text-sm">
        <button className="block w-full text-left px-2 py-1 hover:bg-gray-100">
          ➕ Add Friend
        </button>
        <button className="block w-full text-left px-2 py-1 hover:bg-gray-100">
          💬 Start Chat
        </button>
      </div>
    </div>
  );
}
