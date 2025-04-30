import { ReactNode } from 'react';

export default function LayoutGuest({children}: {children: ReactNode})
{
    return(<section className="pl-4 pr-4 w-full h-full w-screen h-screen flex justify-center items-center bg-gradient-to-br from-blue-50 to-blue-100">    
        {children}
    </section>);
}