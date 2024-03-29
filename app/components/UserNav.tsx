'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { signOut } from 'next-auth/react';

interface UserNavProps {
  userName?: string | null;
  userEmail?: string | null;
}
export default function UserNav(props: UserNavProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-sm">
          <Avatar className="h-10 w-10 rounded-sm">
            <AvatarImage src="https://fzlrnxyvpzqrzaqcvdss.supabase.co/storage/v1/object/sign/Resources/avatar.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJSZXNvdXJjZXMvYXZhdGFyLnBuZyIsImlhdCI6MTcwNzI4OTY0NCwiZXhwIjoxNzM4ODI1NjQ0fQ.q6mqxrAUqbakGLr8iml3mtLybHkKwRCWjbWBgvHfrs8&t=2024-02-07T07%3A07%3A24.281Z" />
            <AvatarFallback className="rounded-sm"></AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{props.userName}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {props.userEmail}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer" onClick={() => signOut()}>
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
