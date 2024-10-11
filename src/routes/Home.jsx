import {useEvent, useEventDispatch, fetchEvent, createEvent} from "../context/EventProvider.jsx";
import Input from "../components/Input.jsx";
import {useState} from "react";
import {redirect} from "react-router-dom";

export default function Home() {
    const [input, setInput] = useState('');
    const dispatch = useEventDispatch();
    const event = useEvent();

    const handleEventCreation = async () => {
        await createEvent(dispatch, input);
        return redirect('/details/' + event.slug);
    };

    const handleEventSearch = async () => {
        await fetchEvent(dispatch, input);
        return redirect('/details/' + event.slug);
    };

    return (
        <div className='flex flex-col grow justify-between gap-4'>
            <div className='flex flex-col gap-4'>
                <h2 className='text-2xl'>Rechercher un évènement</h2>
                <div className='flex flex-row justify-evenly gap-4'>
                    <Input value={input} onChange={e => setInput(e.target.value)} placeholder='Rechercher un évènement...' type='text'></Input>
                    {event.error && <p className='text-red-500'>{event.error}</p>}
                    <button onClick={handleEventSearch} className='w-1/4 bg-blue-500 text-white p-2 rounded-md'>Rechercher</button>
                </div>
                <hr className='grow bg-gray-300 h-0.5'/>
                <div className='flex flex-col gap-4'>
                    <h2 className='text-2xl'>Créer un évènement</h2>
                    <div className='flex flex-row justify-evenly gap-4'>
                        <Input value={input} onChange={e => setInput(e.target.value)} placeholder='Créer un évènement...' type='text'></Input>
                        <button onClick={handleEventCreation} className='w-1/4 bg-blue-500 text-white p-2 rounded-md'>Créer</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
