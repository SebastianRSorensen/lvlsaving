import React from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu'
import { Button } from './ui/button'
import { Avatar, AvatarFallback } from './ui/avatar'
import Image from 'next/image'
import { Icons } from './Icons'
import Link from 'next/link'
import { LogoutLink } from '@kinde-oss/kinde-auth-nextjs/server'

interface UserAccountNavProps {
    email: string | undefined
    name: string
    imageUrl: string
}

const UserAccountNav = async ({ email, imageUrl, name }: UserAccountNavProps) => {

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild className='overflow-visible'>
                <Button className="rounded-full h-8 w-8 aspect-square bg-slate-400">
                    <Avatar className='relative w-8 h-8'>
                        {imageUrl ? (
                            <div className='relative aspect-square h-full w-full'>
                                <Image fill src={imageUrl} alt="profile picture" referrerPolicy="no-referrer" />
                            </div>
                        ) : (<AvatarFallback>
                            <span className='sr-only'>{name}
                            </span>
                            <Icons.user className="h-4 w-4 text-zinc-900" />
                        </AvatarFallback>)}
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='bg-white' align="end">
                <div className='flex items-center justify-start gap-2 p-2'>
                    <div className='flex flex-col space-y-0.5 leading-none'>
                        {name && <p className='text-sm font-medium text-zinc-900'>{name}</p>}
                        {email && <p className='w-[200px] truncate text-xs text-zinc-700'>{email}</p>}
                    </div>
                </div>

                <DropdownMenuSeparator />

                <DropdownMenuItem className='cursor-pointer' asChild>
                    <Link href='/dashboard'>
                        Dashboard
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem className='cursor-pointer'>
                    <LogoutLink>Log out</LogoutLink>
                </DropdownMenuItem>

            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default UserAccountNav