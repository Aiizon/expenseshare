import {useEventDispatch} from "../context/EventProvider.jsx";
import Input from "../components/Input.jsx";
import {useState} from "react";

export default function Home() {
    const [event, setEvent] = useState({});
    const [search, setSearch] = useState('');
    const dispatch = useEventDispatch();
    dispatch({type: 'create', payload: {name: 'test'}});

    return (
        <div className='flex flex-col grow justify-between gap-4'>
            <div className='flex flex-col gap-4'>
                <h2 className='text-2xl'>Rechercher un évènement</h2>
                <Input value={search} onChange={e => setSearch(e.target.value)} placeholder='Rechercher un évènement...' type='text'></Input>
            </div>
            <hr className='grow bg-gray-300 h-0.5'/>
            <div className='flex flex-col gap-4'>
                <h2 className='text-2xl'>Créer un évènement</h2>
                <Input value={event.name} placeholder='Créer un évènement...' type='text'></Input>
            </div>


        </div>
    );
}
