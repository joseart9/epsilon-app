"use client"

import { Button } from "@nextui-org/button";
import Link from "next/link";
import { useUser } from '@/providers/user';
import UserCard from "@/components/UserCard";
import { usePathname } from 'next/navigation';
import { CircularProgress } from "@nextui-org/react";

interface LayoutProps {
    children: React.ReactNode;
}

const routes = [
    {
        name: "Dashboard",
        href: "/admin/dashboard"
    },
    {
        name: "Pedidos",
        href: "/admin/pedidos"
    },
    {
        name: "Finanzas",
        href: "/admin/finanzas"
    },
    {
        name: "Inventario",
        href: "/admin/inventario"
    }
]

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const { user } = useUser();
    const pathname = usePathname()

    if (!user) {
        return (
            <div className="h-screen w-screen flex flex-row">
                <nav className="flex flex-col h-full w-1/6 space-y-5 bg-gray-800 text-white p-2 justify-between">
                    <>
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
                    </>
                    <div className="w-full">
                        <UserCard usuario={user!} />
                    </div>
                </nav>
                <div className="flex flex-col h-full w-full p-2 items-center justify-center">
                    {/* <CircularProgress /> */}
                </div>
            </div>
        )
    }

    if (user?.role !== 'admin') {
        return <div>Acceso denegado</div>
    }
    return (
        <div className="h-screen w-screen flex flex-row">
            <nav className="flex flex-col h-full w-1/6 space-y-5 bg-gray-800 text-white p-2 justify-between">
                <>
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
                </>
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