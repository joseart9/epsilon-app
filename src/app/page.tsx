'use client';

import { Button } from "@nextui-org/button";
import Link from "next/link";
import { useUser } from '@/providers/user';
import { Input } from '@nextui-org/input';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { getUser } from "@/server/actions/user";

export default function Home() {
  const { setUser } = useUser();
  const router = useRouter();
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleUser = async () => {
    try {
      const user = await getUser(inputValue);
      setUser(user!);
      console.log(user);
      if (user?.role === 'admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/user');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className='h-screen w-screen flex flex-col items-center justify-center space-y-3'>
      <div className='flex flex-col space-y-3 p-5 rounded-xl shadow-2xl items-center'>
        <h1 className='text-4xl mb-5'>Bienvenido a Epsilon</h1>
        <Input label='Empleado' value={inputValue} onChange={handleInputChange} />
        <Button className='w-full' color='primary' onClick={handleUser}>Ingresar</Button>
        <Link href='/admin/dashboard' className='w-full'>
          <Button className='w-full mt-10' size="sm" variant="shadow">Administrador</Button>
        </Link>
      </div>
    </div>
  );
}
