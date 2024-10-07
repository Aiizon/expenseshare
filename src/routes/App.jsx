import {useEventDispatch} from "../context/EventProvider.jsx";

export default function App() {
    const dispatch = useEventDispatch();
    dispatch({type: 'create', payload: { name: 'test' }});

    return (
        <>
            sasaasass
            <div>{import.meta.env.VITE_API_URL}</div>
        </>
    );
}
