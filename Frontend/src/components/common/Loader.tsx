import { Tailspin } from 'ldrs/react';
import 'ldrs/react/Tailspin.css';

export default function Loader() {
    return (
        <div className="fixed inset-0 flex items-center justify-center  z-50">
            <Tailspin size={40} stroke={5} speed={0.9} color="black" />
        </div>
    )
}
