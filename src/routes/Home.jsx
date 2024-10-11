import {useEvent, useEventDispatch} from "../context/EventProvider.jsx";
import Input from "../components/Input.jsx";
import {useState} from "react";

export default function Home() {
    const [event, setEvent] = useState({name: ''});
    const {dispatch, fetchEvent} = useEventDispatch();
    const {error} = useEvent();

    const handleEventCreation = () => {
        dispatch({type: 'create', payload: event});
    };

    const handleEventSearch = async () => {
        await fetchEvent(event.slug);
    };

    return (
        <div className='flex flex-col grow justify-between gap-4'>
            <div className='flex flex-col gap-4'>
                <h2 className='text-2xl'>Rechercher un évènement</h2>
                <div className='flex flex-row justify-evenly gap-4'>
                    <Input value={event.name} onChange={e => setEvent({...event, name: e.target.value})} placeholder='Rechercher un évènement...' type='text'></Input>
                    <button onClick={handleEventSearch} className='w-1/4 bg-blue-500 text-white p-2 rounded-md'>Rechercher</button>
                    {error && <p className='text-red-500'>{error}</p>}
                </div>
                <hr className='grow bg-gray-300 h-0.5'/>
                <div className='flex flex-col gap-4'>
                    <h2 className='text-2xl'>Créer un évènement</h2>
                    <div className='flex flex-row justify-evenly gap-4'>
                        <Input value={event.name} onChange={e => setEvent({...event, name: e.target.value})} placeholder='Créer un évènement...' type='text'></Input>
                        <button onClick={handleEventCreation} className='w-1/4 bg-blue-500 text-white p-2 rounded-md'>Créer</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
