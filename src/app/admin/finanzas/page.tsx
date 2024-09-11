"use client";

import useCortes from "@/hooks/useCortes";
import { useEffect, useState } from "react";
import { useUser } from "@/providers/user";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";
import { Timestamp } from "firebase/firestore";

export default function Finanzas() {
    const { user } = useUser();
    const storeId = user?.storeId;

    const [cortes, loading, error, fetchAndSetCortes] = useCortes(storeId!);

    // Mostrar un mensaje mientras se cargan los datos
    if (loading) return <div>Cargando cortes...</div>;
    if (error) return <div>Error al cargar los cortes</div>;

    // Función para convertir el timestamp a una fecha legible
    function displayDate(timestamp: any): string {
        let date;

        // Verifica si el timestamp es de tipo Firebase Timestamp y tiene el método toDate()
        if (timestamp instanceof Timestamp) {
            date = timestamp.toDate();
        }
        // Verifica si ya es un objeto Date
        else if (timestamp instanceof Date) {
            date = timestamp;
        }
        // Verifica si es un objeto con seconds y nanoseconds (formato Firebase)
        else if (timestamp?.seconds) {
            date = new Date(timestamp.seconds * 1000);
        }
        // Si no es ninguno de los anteriores, intenta crear una fecha
        else {
            date = new Date(timestamp);
        }

        return date.toLocaleDateString();
    }

    return (
        <div className='flex flex-col h-full w-full justify-between overflow-auto'>
            <div className='w-full h-full flex flex-col space-y-3 overflow-auto'>
                <div className="flex flex-row w-full shadow-lg rounded-lg p-2 justify-between items-center bg-gray-800 text-white">
                    <div className='flex flex-row w-full items-center space-x-2 justify-between'>
                        <h1 className="text-2xl font-semibold mb-4">Finanzas</h1>
                        <div className='flex flex-row space-x-3 items-center'>
                            <h1>Button</h1>
                        </div>
                    </div>
                </div>

                <Table aria-label="Tabla de Cortes" color="secondary" selectionMode="none">
                    <TableHeader>
                        <TableColumn>Fecha</TableColumn>
                        <TableColumn>Efectivo Total</TableColumn>
                        <TableColumn>Tarjeta Total</TableColumn>
                        <TableColumn>Gastos Total</TableColumn>
                        <TableColumn>Usuario</TableColumn>
                    </TableHeader>
                    <TableBody>
                        {cortes.map((corte, index) => (
                            <TableRow key={index}>
                                <TableCell>{displayDate(corte.date)}</TableCell>
                                <TableCell>${corte.efectivo.total}</TableCell>
                                <TableCell>${corte.tarjeta.total}</TableCell>
                                <TableCell>${corte.gastos.total}</TableCell>
                                <TableCell>{corte.userId}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
