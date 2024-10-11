import {createContext, useContext, useEffect, useReducer} from "react";
import slugify from "../utils/slugify.js";

const apiUrl = import.meta.env.VITE_API_URL;
export const EventContext = createContext(null);
const EventDispatchContext = createContext(null);

export function EventProvider({children}) {
    const [event, dispatch] = useReducer(eventReducer, {name: '', slug: '', persons: [], expenses: []});

    useEffect(() => {
        if (event.name && !event.isFetching) {
            fetch(`${apiUrl}/events`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/ld+json',
                },
                body: JSON.stringify(event),
            });
        }
    }, [event]);

    const fetchEvent = async (slug) => {
        const response = await fetch(`${apiUrl}/events/${slug}`);
        if (404 === response.status) {
            return dispatch({ type: 'error', payload: 'Cet évènement n\'existe pas, veuillez réessayer.' });
        }
        const eventData = await response.json();
        dispatch({ type: 'fetch', payload: eventData });
        dispatch({ type: 'clearError' });
    };

    return (
        <EventContext.Provider value={event}>
            <EventDispatchContext.Provider value={dispatch}>
                {children}
            </EventDispatchContext.Provider>
        </EventContext.Provider>
    );
}

export function useEvent() {
    return useContext(EventContext);
}

export function useEventDispatch() {
    return useContext(EventDispatchContext);
}

export function eventReducer(item, action) {
    switch (action.type) {
        case 'create':
        {
            return {
                name: action.payload.name.toString(),
                slug: slugify(action.payload.name.toString())
            };
        }

        case 'fetch':
            return { ...item, ...action.payload, isFetching: false };
        case 'error':
            return { ...item, error: action.payload };
        case 'clearError':
            return { ...item, error: null };
        default:
            throw new Error(`Unknown action: ${action.type}`);
    }
}