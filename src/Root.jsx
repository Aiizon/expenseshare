import {Link, Outlet} from "react-router-dom";
import {EventProvider} from "./context/EventProvider.jsx";

export default function Root() {
    return (
        <>
            <header className="bg-gray-800 text-white p-4 mb-4">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-evenly">
                        <h1 className="text-2xl">Expenseshare</h1>
                        <nav>
                            <ul className="flex gap-4">
                                <li>
                                    <Link to="/" className="text-blue-200 hover:text-white">Home</Link>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </header>
            <EventProvider>
                <main className="container mx-auto px-4">
                    <Outlet/>
                </main>
            </EventProvider>
        </>
    );
}
