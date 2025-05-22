import { ReactNode } from 'react';
import Menu from '../ui/Menu.tsx'
export default function LayoutGuest({children}: {children: ReactNode})
{
    return(<section className="w-full overflow-x-hidden min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
        <Menu />
        {children}
    </section>);
}