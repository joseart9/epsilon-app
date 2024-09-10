'use client';

import { useUser } from '@/providers/user';
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/react";
import { useState, useRef } from "react";

const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
};

export default function UserInventario() {
    const { user } = useUser();

    const actualDate = new Date().toLocaleDateString('es-ES', options);

    // Estado separado para cada campo
    const [tarjeta, setTarjeta] = useState("");
    const [efectivo, setEfectivo] = useState("");
    const [gastos, setGastos] = useState("");
    const [file, setFile] = useState<File | null>(null); // Estado para la foto

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    // Función para manejar los cambios de entrada
    const handleInputChange = (setter: any) => (e: any) => {
        const inputValue = e.target.value.replace(/,/g, ''); // Eliminar comas existentes
        if (!isNaN(inputValue)) {
            const formattedValue = inputValue === "" ? "" : parseFloat(inputValue).toLocaleString("en-US"); // Formatear con comas
            setter(formattedValue);
        }
    };

    // Función para convertir el valor formateado a número (sin comas) o retornar 0 si está vacío
    const parseValueToNumber = (value: string): number => {
        return value === "" ? 0 : parseFloat(value.replace(/,/g, ""));
    };

    // Función para manejar el archivo (foto) seleccionado
    const handleFileChange = (e: any) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
    };

    // Verificar si al menos un monto es mayor a 0
    const isMontoGreaterThanZero = () => {
        return parseValueToNumber(tarjeta) > 0 || parseValueToNumber(efectivo) > 0 || parseValueToNumber(gastos) > 0;
    };

    // Función para enviar los valores a la consola como números
    const handleSend = () => {
        const tarjetaNumber = parseValueToNumber(tarjeta);
        const efectivoNumber = parseValueToNumber(efectivo);
        const gastosNumber = parseValueToNumber(gastos);

        // Si al menos un monto es mayor a 0, la foto es requerida
        if (isMontoGreaterThanZero() && !file) {
            alert("Es necesario subir una foto si el monto es mayor a 0.");
            return;
        }

        console.log("Tarjeta:", tarjetaNumber);
        console.log("Efectivo:", efectivoNumber);
        console.log("Gastos:", gastosNumber);
        console.log("Foto:", file ? file.name : "No se subió ninguna foto");
    };

    const handleClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click(); // Simular el clic en el input de archivo
        }
    };

    return (
        <div className='flex flex-col h-full w-full justify-between overflow-auto'>
            <div className='w-full h-full flex flex-col space-y-3 overflow-auto'>
                <div className="flex flex-row w-full shadow-lg rounded-lg p-2 justify-between items-center bg-gray-800 text-white">
                    <div className='flex flex-row items-center space-x-2'>
                        <h1 className='text-xl ml-4 font-semibold'>Corte</h1>
                        <h1 className='text-xl mr-4 font-semibold'>{actualDate}</h1>
                    </div>
                </div>
                <div className='flex flex-col space-y-3 h-full w-full items-center justify-center'>
                    {/* Input para Tarjeta */}
                    <div className='flex flex-row items-center space-x-2 w-full justify-center'>
                        <Input
                            label="Tarjeta"
                            type="text"
                            placeholder="0.00"
                            value={tarjeta}
                            onChange={handleInputChange(setTarjeta)}
                            startContent={
                                <div className="pointer-events-none flex items-center">
                                    <span className="text-default-400 text-small">$</span>
                                </div>
                            }
                            className='w-2/4'
                        />

                        {/* Botón personalizado para cargar una imagen */}
                        <Button
                            color="primary"
                            onClick={handleClick} // Al hacer clic, abre el selector de archivos
                            isIconOnly
                            className="p-2 rounded-full"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                            </svg>
                        </Button>

                        {/* Input de archivo oculto */}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            style={{ display: 'none' }} // Ocultar el input de archivo
                        />
                    </div>

                    <div className='flex flex-row items-center space-x-2 w-full justify-center'>
                        {/* Input para Efectivo */}
                        <Input
                            label="Efectivo"
                            type="text"
                            placeholder="0.00"
                            value={efectivo}
                            onChange={handleInputChange(setEfectivo)}
                            startContent={
                                <div className="pointer-events-none flex items-center">
                                    <span className="text-default-400 text-small">$</span>
                                </div>
                            }
                            className='w-2/4'
                        />

                        {/* Botón personalizado para cargar una imagen */}
                        <Button
                            color="primary"
                            onClick={handleClick} // Al hacer clic, abre el selector de archivos
                            isIconOnly
                            className="p-2 rounded-full"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                            </svg>
                        </Button>

                        {/* Input de archivo oculto */}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            style={{ display: 'none' }} // Ocultar el input de archivo
                        />
                    </div>


                    <div className='flex flex-row items-center space-x-2 w-full justify-center'>
                        {/* Input para Gastos */}
                        <Input
                            label="Gastos"
                            type="text"
                            placeholder="0.00"
                            value={gastos}
                            onChange={handleInputChange(setGastos)}
                            startContent={
                                <div className="pointer-events-none flex items-center">
                                    <span className="text-default-400 text-small">$</span>
                                </div>
                            }
                            className='w-2/4'
                        />

                        {/* Botón personalizado para cargar una imagen */}
                        <Button
                            color="primary"
                            onClick={handleClick} // Al hacer clic, abre el selector de archivos
                            isIconOnly
                            className="p-2 rounded-full"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                            </svg>
                        </Button>

                        {/* Input de archivo oculto */}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            style={{ display: 'none' }} // Ocultar el input de archivo
                        />
                    </div>

                    {/* Botón para enviar los valores */}
                    <Button color="primary" onClick={handleSend}>
                        Enviar
                    </Button>
                </div>
            </div>
        </div>
    );
}
