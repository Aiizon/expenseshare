import {useEvent, useEventDispatch, fetchEvent} from "../context/EventProvider.jsx";
import {redirect, useParams} from "react-router-dom";

export default function Details() {
    const dispatch = useEventDispatch();
    const event = useEvent();
    const {slug} = useParams();

    const fetch = async () => {
        await fetchEvent(dispatch, slug);
        if (event.error) {
            return redirect('/');
        }
    }
    fetch();

    return (
        <div className='flex flex-col justify-center gap-4'>
            <h2 className='justify-self-center text-2xl'>Détails de l'évènement "{event.name}"</h2>
        </div>
    );
}