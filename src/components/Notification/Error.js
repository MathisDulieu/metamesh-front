import { useState, useEffect } from "react";
import { RxCross1 } from "react-icons/rx";

export default function Error({ message, setMessage }) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (message) {
            setIsVisible(true);
            const timer = setTimeout(() => {
                setIsVisible(false);
                setMessage('');
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [message, setMessage]);

    const handleClose = () => {
        setIsVisible(false);
        setMessage('');
    }

    return (
        <>
            {isVisible && (
                <div className={`fixed bottom-2 left-1/2 transform -translate-x-1/2 w-1/3 z-50 ${isVisible ? 'animate__fadeInUp' : 'animate__fadeOutDown'}`}>
                    <div className="text-center bg-red-300 border border-red-400 text-red-700 px-4 py-3 w-50 rounded-lg" role="alert">
                        <strong className="font-bold"></strong>
                        <span className="block sm:inline">{message}</span>
                        <button className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={handleClose}>
                            <RxCross1 className="fill-current h-6 w-6 text-red-500" />
                        </button>
                    </div>
                </div>
            )}
        </>
    )
}