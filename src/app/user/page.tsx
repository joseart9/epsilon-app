'use client';

import { useUser } from '@/providers/user';

export default function User() {
    const { user } = useUser();
    return (
        <div>
        </div>
    )
}