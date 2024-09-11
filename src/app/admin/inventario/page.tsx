"use client";

import { useUser } from '@/providers/user';
import { useEffect, useState } from "react";
import useProducts from "@/hooks/useProducts";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Button, Input, CircularProgress } from "@nextui-org/react";
import Product from "@/types/product";
import Drawer from 'react-modern-drawer';
import 'react-modern-drawer/dist/index.css';
import { updateProductByStoreId, createProductByStoreId } from '@/server/actions/product';

export default function Inventario() {
    const { user } = useUser();

    const [storeId, setStoreId] = useState<number | null>(null);
    const [isOpen, setIsOpen] = useState(false); // Estado para manejar la visibilidad del drawer
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null); // Producto seleccionado o nuevo
    const [isSaving, setIsSaving] = useState(false); // Estado de carga para el botón de guardado
    const [searchQuery, setSearchQuery] = useState(""); // Estado para el valor de búsqueda

    // Estado local para los valores de los inputs
    const [sku, setSku] = useState("");
    const [name, setName] = useState("");
    const [stock, setStock] = useState<number | string>("");

    useEffect(() => {
        if (user?.storeId && storeId !== Number(user.storeId)) {
            setStoreId(Number(user.storeId));
        }
    }, [user, storeId]);

    const [products, loading, error, fetchAndSetProducts] = useProducts(storeId ?? 0);

    // Mostrar un mensaje mientras se cargan los productos
    if (loading) return (
        <div className='flex w-full h-full justify-center items-center'>
            <CircularProgress />
        </div>);
    if (error) return <div>Error al cargar los productos</div>;

    // Filtrar productos según el valor de búsqueda
    const filteredProducts = products.filter((product) => {
        return (
            product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    });

    // Abrir el drawer con el producto seleccionado
    const handleRowClick = (row: any) => {
        const product = products.find(p => p.sku === row); // Encuentra el producto por el SKU
        if (product) {
            setSelectedProduct(product); // Establece el producto seleccionado
            // Inicializa los valores de los inputs con los datos del producto seleccionado
            setSku(product.sku);
            setName(product.name);
            setStock(product.stock);
        }
        setIsOpen(true); // Abre el drawer
    };

    // Abrir el drawer para agregar un nuevo producto
    const handleAddProduct = () => {
        setSelectedProduct(null); // Limpia el producto seleccionado
        setSku(""); // Limpia los inputs
        setName("");
        setStock("");
        setIsOpen(true); // Abre el drawer
    };

    const toggleDrawer = () => {
        setIsOpen((prevState) => !prevState);
    };

    // Función para manejar el guardado
    const handleSaveProduct = async () => {
        setIsSaving(true); // Activa el estado de carga
        try {
            if (selectedProduct) {
                // Actualiza el producto en la base de datos
                await updateProductByStoreId(storeId ?? 0, selectedProduct.sku, {
                    sku,
                    name,
                    stock: Number(stock)
                });
            } else {
                // Crea un nuevo producto en la base de datos
                await createProductByStoreId(storeId ?? 0, {
                    sku,
                    name,
                    stock: Number(stock)
                });
            }

            setIsSaving(false);

            // Actualiza los productos en el frontend llamando al hook
            await fetchAndSetProducts();
        } catch (error) {
            console.error("Error al guardar el producto:", error);
        }

        setIsOpen(false); // Cierra el drawer después de guardar
    };

    return (
        <div className='flex flex-col h-full w-full justify-between overflow-auto'>
            <div className='w-full h-full flex flex-col space-y-3 overflow-auto'>
                <div className="flex flex-row w-full shadow-lg rounded-lg p-2 justify-between items-center bg-gray-800 text-white">
                    <div className='flex flex-row w-full items-center space-x-2 justify-between'>
                        <h1 className='text-xl ml-4 font-semibold'>Inventario de Productos</h1>
                        <div className='flex flex-row space-x-3 items-center'>
                            <Input
                                label="Buscar producto"
                                size='sm'
                                color='default'
                                className='w-fit'
                                radius='lg'
                                value={searchQuery}
                                isClearable
                                onClear={() => setSearchQuery("")} // Limpia el valor de búsqueda
                                onChange={(e) => setSearchQuery(e.target.value)} // Actualiza el valor de búsqueda
                                startContent={
                                    <svg xmlns="http://www.w3.org/2000/svg" focusable="false" aria-hidden="true" height="1em" width="1em" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                                    </svg>
                                }
                                classNames={{
                                    label: "text-black/50 dark:text-white/90",
                                    input: [
                                        "bg-transparent",
                                        "text-black/90 dark:text-white/90",
                                        "placeholder:text-default-700/50 dark:placeholder:text-white/60",
                                    ],
                                    innerWrapper: "bg-transparent",
                                    inputWrapper: [
                                        "shadow-xl",
                                        "bg-default-100/50",
                                        "dark:bg-default/60",
                                        "backdrop-blur-xl",
                                        "backdrop-saturate-200",
                                        "hover:bg-default-100/70",
                                        "dark:hover:bg-default/70",
                                        "group-data-[focus=true]:bg-default-100/50",
                                        "dark:group-data-[focus=true]:bg-default-200/60",
                                        "!cursor-text",
                                    ],
                                }}
                            />
                            <Button size='lg' color='primary' onClick={handleAddProduct}>
                                Agregar Producto
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Tabla para mostrar los productos filtrados */}
                <Table
                    aria-label="Tabla de inventario de productos"
                    selectionMode="single"
                    color="default"
                    className='p-0.5'
                    onRowAction={(row) => handleRowClick(row)}
                >
                    <TableHeader>
                        <TableColumn>SKU</TableColumn>
                        <TableColumn>PRODUCTO</TableColumn>
                        <TableColumn>STOCK</TableColumn>
                    </TableHeader>
                    <TableBody>
                        {filteredProducts.map((product) => (
                            <TableRow
                                key={product.sku}
                                className='cursor-pointer'
                                onClick={() => handleRowClick(product.sku)} // Aquí pasamos el SKU como row
                            >
                                <TableCell>{product.sku}</TableCell>
                                <TableCell>{product.name}</TableCell>
                                <TableCell>{product.stock}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Drawer que aparece al hacer clic en una fila o al agregar un producto */}
            <Drawer
                open={isOpen}
                onClose={toggleDrawer}
                direction='right'
                style={{ background: 'rgb(31 41 55)', color: 'white' }}
                size={500}
            >
                <div className="p-4 h-full w-full">
                    <div className='flex flex-col h-full w-full space-y-4 justify-between overflow-auto'>
                        <div className='flex flex-col space-y-4 overflow-auto'>
                            <h2 className="text-lg font-bold">{selectedProduct ? "Detalles del Producto" : "Agregar Producto"}</h2>
                            <div className='flex flex-col space-y-4 overflow-auto'>
                                <Input
                                    label="Sku"
                                    type="text"
                                    value={sku}
                                    onChange={(e) => setSku(e.target.value)} // Maneja el cambio de valor
                                />
                                <Input
                                    label="Nombre"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)} // Maneja el cambio de valor
                                />
                                <Input
                                    label="Cantidad"
                                    type="number"
                                    value={stock.toString()}
                                    onChange={(e) => setStock(e.target.value)} // Maneja el cambio de valor
                                />
                            </div>
                        </div>
                        <Button size='lg' color='primary' onClick={handleSaveProduct} disabled={isSaving} isLoading={isSaving}>
                            Guardar
                        </Button>
                    </div>
                </div>
            </Drawer>
        </div>
    );
}
