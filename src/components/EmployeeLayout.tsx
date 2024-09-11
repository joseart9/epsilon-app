"use client";

import { Button } from "@nextui-org/button";
import Link from "next/link";
import { usePathname } from 'next/navigation'
import UserCard from "@/components/UserCard";
import { useUser } from '@/providers/user';

interface LayoutProps {
    children: React.ReactNode;
}

const routes = [
    {
        name: "Inventario",
        href: "/user/inventario"
    },
    {
        name: "Corte de Caja",
        href: "/user/corte"
    }
]

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const { user } = useUser();
    const pathname = usePathname()

    return (
        <div className="h-screen w-screen flex flex-row">
            <nav className="flex flex-col h-full w-1/6 space-y-5 bg-gray-800 text-white p-2 justify-between">
                <div className="flex w-full justify-center">
                    Logo
                </div>
                <ul className="flex flex-col h-full w-full items-center space-y-5">
                    {routes.map((route) => (
                        <li key={route.href} className="w-full">
                            <Link href={route.href}>
                                <Button
                                    className="w-full"
                                    radius="full"
                                    size="md"
                                    color="primary"
                                    variant={pathname === route.href ? "solid" : "flat"}
                                >
                                    {route.name}
                                </Button>
                            </Link>
                        </li>
                    ))}
                </ul>
                <div className="w-full">
                    <UserCard usuario={user!} />
                </div>
            </nav>
            <div className="flex flex-col h-full w-full p-2">
                {children}
            </div>
        </div>
    );
}

export default Layout;
