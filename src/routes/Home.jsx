import {useEvent, useEventDispatch, fetchEvent, createEvent} from "../context/EventProvider.jsx";
import Input from "../components/Input.jsx";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import slugify from "../utils/slugify.js";

export default function Home() {
    const dispatch = useEventDispatch();
    const event = useEvent();
    const navigate = useNavigate();
    const [searchInput, setSearchInput] = useState('');
    const [createInput, setCreateInput] = useState('');
    const [lastInput, setLastInput] = useState('');

    const checkInput = (input, isSlug = true) => {
        dispatch({type: 'clearError'});
        if ('' === input) {
            dispatch({type: 'error', payload: 'Veuillez saisir un slug d\'évènement.'});
            return;
        }
        if (isSlug && !input.toString().match(/^[a-z0-9]+(?:[_-][a-z0-9]+)*$/)) {
            dispatch({type: 'error', payload: 'Le slug ne doit contenir que des lettres minuscules, des chiffres, des tirets et des underscores.'});
        }
    }

    const handleEventSearch = async () => {
        setLastInput('search');
        checkInput(searchInput);
        await fetchEvent(dispatch, searchInput);
        if (null !== event.error) {
            navigate('/details/' + searchInput);
        }
    };

    const handleEventCreation = async () => {
        setLastInput('create');
        checkInput(createInput, false);
        await createEvent(dispatch, createInput);
        if (null !== event.error) {
            // @todo: trouver un moyen de récupérer le vrai slug de l'évènement au lieu de le deviner sans faire planter l'app
            navigate('/details/' + slugify(createInput));
        }
    };

    return (
        <div className='flex flex-col grow justify-between gap-4'>
            <div className='flex flex-col gap-4'>
                <h2 className='text-2xl'>Rechercher un évènement</h2>
                <div className='flex flex-row justify-evenly gap-4'>
                    <Input value={searchInput} onChange={e => setSearchInput(e.target.value)} placeholder='Rechercher un évènement...' type='text'></Input>
                    {event.error && 'search' === lastInput && <p className='text-red-500'>{event.error}</p>}
                    <button onClick={handleEventSearch} className='w-1/4 bg-blue-500 text-white p-2 rounded-md'>Rechercher</button>
                </div>
                <hr className='grow bg-gray-300 h-0.5'/>
                <div className='flex flex-col gap-4'>
                    <h2 className='text-2xl'>Créer un évènement</h2>
                    <div className='flex flex-row justify-evenly gap-4'>
                        {event.error && 'create' === lastInput && <p className='text-red-500'>{event.error}</p>}
                        <Input value={createInput} onChange={e => setCreateInput(e.target.value)} placeholder='Créer un évènement...' type='text'></Input>
                        <button onClick={handleEventCreation} className='w-1/4 bg-blue-500 text-white p-2 rounded-md'>Créer</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
