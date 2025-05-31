import { useState } from "react";
import { Popover } from "@headlessui/react";
import { UserIcon } from "@heroicons/react/24/outline";

interface Props {
  username: string;
  onChat: () => void;
  onAddFriend: () => void;
}

export default function UserAvatarPopover({ username, onChat, onAddFriend }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Popover className="relative">
      <Popover.Button onClick={() => setOpen(!open)} className="flex items-center gap-2">
        <UserIcon className="w-5 h-5" />
        <span>{username}</span>
      </Popover.Button>

      {open && (
        <Popover.Panel className="absolute z-10 bg-white border shadow rounded p-2 w-40 mt-1">
          <button
            className="block w-full text-left text-sm py-1 hover:bg-gray-100"
            onClick={onChat}
          >
            Chat
          </button>
          <button
            className="block w-full text-left text-sm py-1 hover:bg-gray-100"
            onClick={onAddFriend}
          >
            Add Friend
          </button>
        </Popover.Panel>
      )}
    </Popover>
  );
}
