"use client";
import React from "react";
import { User, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/react";
import UserInterface from "@/types/user";
import { useRouter } from 'next/navigation';

interface UserCardProps {
    usuario: UserInterface;
}

const UserCard: React.FC<UserCardProps> = ({ usuario }) => {
    const router = useRouter();

    const roleDescription = (role: string | undefined) => {
        switch (role) {
            case 'employee':
                return 'Empleado';
            case 'admin':
                return 'Administrador';
            default:
                return 'Desconocido';
        }
    };

    const handleLogout = () => {
        // Aquí puedes añadir la lógica para cerrar sesión si es necesario
        router.push('/');
    };

    return (
        <div className="w-full">
            <Dropdown placement="bottom-start" className="w-full">
                <DropdownTrigger className="w-full justify-start">
                    <User
                        as="button"
                        avatarProps={{
                            isBordered: true,
                            src: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
                        }}
                        className="transition-transform"
                        description={roleDescription(usuario?.role)}
                        name={usuario?.name}
                    />
                </DropdownTrigger>
                <DropdownMenu aria-label="User Actions" variant="flat">
                    <DropdownItem key="profile" className="h-14 gap-2">
                        <p className="font-bold">Identificador</p>
                        <p className="font-bold">#{usuario?.identifier}</p>
                    </DropdownItem>

                    <DropdownItem key="logout" color="danger" onClick={handleLogout}>
                        Salir
                    </DropdownItem>
                </DropdownMenu>
            </Dropdown>
        </div>
    );
}

export default UserCard;
