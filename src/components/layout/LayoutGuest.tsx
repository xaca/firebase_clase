import { ReactNode } from 'react';

export default function LayoutGuest({children}: {children: ReactNode})
{
    return(<section className="w-full h-full w-screen h-screen flex bg-gradient-to-br from-blue-50 to-blue-100">    
        {children}
    </section>);
}