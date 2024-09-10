"use client";

import { useUser } from '@/providers/user';
import useProducts from '@/hooks/useProducts';
import { useEffect, useState } from 'react';
import { CircularProgress, Autocomplete, AutocompleteItem, Input } from "@nextui-org/react";
import { Button } from "@nextui-org/button";

import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";

// Utility functions
import { saveSalesConverter } from '@/utils';

// Server actions
import { saveSale } from "@/server/actions/sales";

interface Row {
    key: string;
    sku: string;
    producto: string;
    cantidad: string;
}

const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
};

const columns = [
    {
        key: "sku",
        label: "SKU",
    },
    {
        key: "producto",
        label: "PRODUCTO",
    },
    {
        key: "cantidad",
        label: "CANTIDAD",
    },
    {
        key: "actions",
        label: "ACCIONES",
    },
];

export default function UserInventario() {
    const { user } = useUser();
    const [storeId, setStoreId] = useState<number | null>(null);
    const [rows, setRows] = useState<Row[]>([]);

    const { products, loading, error } = useProducts(storeId ?? 0);

    const actualDate = new Date().toLocaleDateString('es-ES', options);

    useEffect(() => {
        if (user?.storeId && storeId !== Number(user.storeId)) {
            setStoreId(Number(user.storeId));
        }
    }, [user, storeId]);

    const handleAddRow = () => {
        const newRow: Row = {
            key: `${rows.length + 1}-${Date.now()}`, // Use a unique key
            sku: "",
            producto: "",
            cantidad: "0",
        };
        setRows(prevRows => [...prevRows, newRow]);
    };

    const handleDeleteRow = (key: string) => {
        setRows(prevRows => prevRows.filter(row => row.key !== key));
    };

    const handleInputChange = (key: string, column: string, value: string) => {
        setRows(prevRows =>
            prevRows.map(row =>
                row.key === key ? { ...row, [column]: value } : row
            )
        );
    };

    const handleQuantityChange = (key: string, change: number) => {
        setRows(prevRows =>
            prevRows.map(row => {
                if (row.key === key) {
                    const newQuantity = Math.max(0, parseInt(row.cantidad) + change);
                    return { ...row, cantidad: newQuantity.toString() };
                }
                return row;
            })
        );
    };

    const handleSubmit = async () => {
        console.log('Información del inventario:', rows);
        const sales = saveSalesConverter(rows, user?.storeId!);
        console.log(sales);

        // Add current date to sales

        const salesWithDate = { ...sales, date: new Date() };
        const res = await saveSale(salesWithDate);

        if (res) {
            alert('Inventario guardado exitosamente');
        } else {
            alert('Error al guardar el inventario');
        }
    };

    if (error) return <p>Error al cargar los productos: {error.message}</p>;

    if (!user || loading) return (
        <div className='flex w-full h-full justify-center items-center'>
            <CircularProgress />
        </div>
    );

    return (
        <div className='flex flex-col h-full w-full justify-between overflow-auto'>
            <div className='w-full h-full flex flex-col space-y-3 overflow-auto'>
                <div className="flex flex-row w-full shadow-lg rounded-lg p-2 justify-between items-center bg-gray-800 text-white">
                    <div className='flex flex-row items-center space-x-2'>
                        <h1 className='text-xl ml-4 font-semibold'>Inventario</h1>
                        <h1 className='text-xl mr-4 font-semibold'>{actualDate}</h1>
                    </div>
                    <Button variant="solid" size="sm" radius='full' onClick={handleAddRow} color="primary">Agregar Producto</Button>
                </div>
                <Table aria-label="Tabla de inventario" className='overflow-auto shadow-xl'>
                    <TableHeader columns={columns}>
                        {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
                    </TableHeader>
                    <TableBody items={rows}>
                        {(item) => (
                            <TableRow key={item.key}>
                                {(columnKey) => (
                                    <TableCell>
                                        {columnKey === 'producto' ? (
                                            <Autocomplete
                                                aria-label="Selecciona un producto"
                                                placeholder="Selecciona un producto"
                                                defaultItems={products.map(product => ({
                                                    key: product.sku,
                                                    label: product.name
                                                }))}
                                                value={item[columnKey as keyof Row] || ''}
                                                onSelectionChange={(selectedKey) => {
                                                    const selectedProduct = products.find(product => product.sku === selectedKey);
                                                    if (selectedProduct) {
                                                        handleInputChange(item.key, 'producto', selectedProduct.name);
                                                        handleInputChange(item.key, 'sku', selectedProduct.sku);
                                                    }
                                                }}
                                            >
                                                {(item) => (
                                                    <AutocompleteItem key={item.key} value={item.key}>
                                                        {item.label}
                                                    </AutocompleteItem>
                                                )}
                                            </Autocomplete>
                                        ) : columnKey === 'cantidad' ? (
                                            <div className="flex items-center space-x-2">

                                                <Button size="sm" radius='full' color="success" onClick={() => handleQuantityChange(item.key, 1)} isIconOnly className='text-white'>
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                                    </svg>
                                                </Button>

                                                <Input
                                                    type="text"
                                                    value={item[columnKey as keyof Row] || ''}
                                                    onChange={(e) =>
                                                        handleInputChange(item.key, columnKey as keyof Row, e.target.value)
                                                    }
                                                    className="w-16"
                                                    size="sm"
                                                />
                                                <Button size="sm" radius='full' color="danger" onClick={() => handleQuantityChange(item.key, -1)} isIconOnly className='text-white'>
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
                                                    </svg>
                                                </Button>
                                            </div>
                                        ) : columnKey === 'actions' ? (
                                            <Button size="sm" radius='full' color="danger" onClick={() => handleDeleteRow(item.key)} isIconOnly>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                                </svg>
                                            </Button>
                                        ) : (
                                            <Input
                                                type="text"
                                                disabled
                                                value={item[columnKey as keyof Row] || ''}
                                                onChange={(e) =>
                                                    handleInputChange(item.key, columnKey as keyof Row, e.target.value)
                                                }
                                            />
                                        )}
                                    </TableCell>
                                )}
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className='flex w-full justify-end'>
                <Button color="primary" className='w-fit' onClick={handleSubmit}>Enviar</Button>
            </div>
        </div>
    );
}
