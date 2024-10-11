import {useEvent, useEventDispatch, fetchEvent} from "../context/EventProvider.jsx";
import {useNavigate, useParams} from "react-router-dom";
import {useState} from "react";

export default function Details() {
    const dispatch = useEventDispatch();
    const event = useEvent();
    const {slug} = useParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);

    const fetch = async () => {
        await fetchEvent(dispatch, slug);
        if (event.error) {
            navigate('/');
        }
        setIsLoading(false);
    }
    fetch();

    if (isLoading) {
        return (
            <p className='flex flex-col grow h-max w-max content-center items-center'>Chargement...</p>
        );
    }

    return (
        <div className='flex flex-col grow justify-between gap-4'>
            <div className='flex flex-col gap-4'>
                <h2 className='text-2xl'>Détails de l'évènement</h2>
                <div className='flex flex-row justify-evenly gap-4'>
                    <p className='text-xl'>Nom: {event.name}</p>
                    <p className='text-xl'>Slug: {event.slug}</p>
                </div>
                <hr className='grow bg-gray-300 h-0.5'/>
                <div className='flex flex-col gap-4'>
                    <div className='flex flex-col justify-evenly'>
                        <h2 className='text-2xl'>Participants</h2>
                        <button className='size-10 bg-green-500 hover:bg-green-800 cursor-pointer text-white p-2 rounded-md'>+</button>
                    </div>
                    <div className='flex flex-row justify-evenly gap-4'>
                        <ul>
                            {event.persons.map((person, index) => (
                                <li key={index}>{person.name}</li>
                            ))}
                        </ul>
                    </div>
                </div>
                <hr className='grow bg-gray-300 h-0.5'/>
                <div className='flex flex-col gap-4'>
                    <div className='flex flex-col justify-evenly'>
                        <h2 className='text-2xl'>Dépenses</h2>
                        <button className='size-10 bg-green-500 hover:bg-green-800 cursor-pointer text-white p-2 rounded-md'>+</button>
                    </div>
                    <div className='flex flex-row justify-evenly gap-4'>
                        <ul>
                            {event.expenses.map((expense, index) => (
                                <li key={index}>{expense.title} - {expense.amount}€</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}