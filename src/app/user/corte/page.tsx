'use client';

import { useUser } from '@/providers/user';
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/react";
import { useState, useRef } from "react";
import axios from 'axios'; // Import axios
import { saveCorteData } from "@/server/actions/corte"; // Import saveCorteData function

import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/firebase";

const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
};

export default function UserCorte() {
    const { user } = useUser();  // Assume user object contains storeId

    const actualDate = new Date().toLocaleDateString('es-ES', options);
    const [tarjeta, setTarjeta] = useState("");
    const [efectivo, setEfectivo] = useState("");
    const [gastos, setGastos] = useState("");

    const [tarjetaFile, setTarjetaFile] = useState<File | null>(null);
    const [efectivoFile, setEfectivoFile] = useState<File | null>(null);
    const [gastosFile, setGastosFile] = useState<File | null>(null);


    const [uploading, setUploading] = useState(false);
    const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

    const tarjetaInputRef = useRef<HTMLInputElement | null>(null);
    const efectivoInputRef = useRef<HTMLInputElement | null>(null);
    const gastosInputRef = useRef<HTMLInputElement | null>(null);

    // Handle input changes
    const handleInputChange = (setter: any) => (e: any) => {
        const inputValue = e.target.value.replace(/,/g, '');
        if (!isNaN(inputValue)) {
            const formattedValue = inputValue === "" ? "" : parseFloat(inputValue).toLocaleString("en-US");
            setter(formattedValue);
        }
    };

    // Convert formatted value to number
    const parseValueToNumber = (value: string): number => {
        return value === "" ? 0 : parseFloat(value.replace(/,/g, ""));
    };

    // Handle file change
    const handleFileChange = (e: any, type: string) => {
        const selectedFile = e.target.files[0];
        if (type === "tarjeta") {
            setTarjetaFile(selectedFile);
        } else if (type === "efectivo") {
            setEfectivoFile(selectedFile);
        } else if (type === "gastos") {
            setGastosFile(selectedFile);
        }
    };

    // Function to handle file upload to Firebase
    const handleUpload = async (type: string, file: File, reference: string) => {
        console.log(file);
        if (!file) return;

        const storeId = user?.storeId;
        const currentDate = new Date().toISOString().split('T')[0];
        const fileName = `${storeId}_${type}_${currentDate}.jpeg`;

        console.log("Uploading file:", fileName);

        setUploading(true);
        const storageRef = ref(storage, `${reference}/${fileName}`);

        try {
            await uploadBytes(storageRef, file);
            const url = await getDownloadURL(storageRef);
            setUploadedUrl(url);
            console.log("File uploaded successfully:", url);
            return url;
        } catch (error) {
            console.error('Error uploading the file', error);
        } finally {
            setUploading(false);
        }
    };

    // Function to handle form submission
    const handleSend = async () => {
        const tarjetaNumber = parseValueToNumber(tarjeta);
        const efectivoNumber = parseValueToNumber(efectivo);
        const gastosNumber = parseValueToNumber(gastos);

        let tarjetaUrl = "";
        let efectivoUrl = "";
        let gastosUrl = "";

        if (tarjetaNumber > 0 && tarjetaFile) {
            tarjetaUrl = await handleUpload("tarjeta", tarjetaFile, "tarjeta") || "";
        }
        if (efectivoNumber > 0 && efectivoFile) {
            efectivoUrl = await handleUpload("efectivo", efectivoFile, "efectivo") || "";
        }
        if (gastosNumber > 0 && gastosFile) {
            gastosUrl = await handleUpload("gastos", gastosFile, "gastos") || "";
        }

        const corte = {
            storeId: user?.storeId || 0,  // Assuming storeId comes from the user object
            efectivo: {
                total: efectivoNumber,
                imageUrl: efectivoUrl,
            },
            tarjeta: {
                total: tarjetaNumber,
                imageUrl: tarjetaUrl,
            },
            gastos: {
                total: gastosNumber,
                imageUrl: gastosUrl,
            },
            date: new Date(), // Current date
            userId: user?.identifier || 0,  // Assuming userId comes from the user object
        };

        try {
            await saveCorteData(corte);
            console.log("Corte saved successfully");
        } catch (error) {
            console.error("Error saving corte:", error);
        }

        console.log("Tarjeta:", tarjetaNumber);
        console.log("Efectivo:", efectivoNumber);
        console.log("Gastos:", gastosNumber);

    };

    const handleClick = (type: string) => {
        if (type === "tarjeta" && tarjetaInputRef.current) {
            tarjetaInputRef.current.click();
        } else if (type === "efectivo" && efectivoInputRef.current) {
            efectivoInputRef.current.click();
        } else if (type === "gastos" && gastosInputRef.current) {
            gastosInputRef.current.click();
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
                            onClick={() => handleClick("tarjeta")} // Al hacer clic, abre el selector de archivos
                            isIconOnly
                            className="p-2 rounded-full"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                            </svg>
                        </Button>

                        {/* Input de archivo oculto */}
                        <input
                            ref={tarjetaInputRef}
                            type="file"
                            accept="image/*"
                            onChange={(event) => handleFileChange(event, "tarjeta")}
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
                            onClick={() => handleClick("efectivo")} // Al hacer clic, abre el selector de archivos
                            isIconOnly
                            className="p-2 rounded-full"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                            </svg>
                        </Button>

                        {/* Input de archivo oculto */}
                        <input
                            ref={efectivoInputRef}
                            type="file"
                            accept="image/*"
                            onChange={(event) => handleFileChange(event, "efectivo")}
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
                            onClick={() => handleClick("gastos")} // Al hacer clic, abre el selector de archivos
                            isIconOnly
                            className="p-2 rounded-full"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                            </svg>
                        </Button>

                        {/* Input de archivo oculto */}
                        <input
                            ref={gastosInputRef}
                            type="file"
                            accept="image/*"
                            onChange={(event) => handleFileChange(event, "gastos")}
                            style={{ display: 'none' }} // Ocultar el input de archivo
                        />
                    </div>

                    {/* Botón para enviar los valores */}
                    <Button color="primary" onClick={handleSend} isLoading={uploading}>
                        Enviar
                    </Button>
                </div>
            </div>
        </div>
    );
}
