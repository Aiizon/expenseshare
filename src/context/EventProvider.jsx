import {createContext, useContext, useEffect, useReducer} from "react";
import slugify from "../utils/slugify.js";

const apiUrl = import.meta.env.VITE_API_URL;
export const EventContext = createContext(null);
const EventDispatchContext = createContext(null);

export function EventProvider({children}) {
    const [event, dispatch] = useReducer(eventReducer, {name: '', slug: '', persons: [], expenses: []});

    useEffect(() => {
        async function createEvent() {
            if (event.name && event.isCreating) {
                await fetch(`${apiUrl}/events`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/ld+json',
                    },
                    body: JSON.stringify({
                        name: event.name,
                        slug: event.slug,
                        persons: event.persons,
                        expenses: event.expenses,
                    }),
                })
                dispatch({type: 'creationComplete'});
            }
            createEvent();
        }
    }, [event]);

    return (
        <EventContext.Provider value={event}>
            <EventDispatchContext.Provider value={dispatch}>
                {children}
            </EventDispatchContext.Provider>
        </EventContext.Provider>
    );
}

export async function fetchEvent(dispatch, name) {
    const slug = slugify(name);
    const response = await fetch(`${apiUrl}/events/${slug}`);
    if (404 === response.status) {
        return dispatch({ type: 'error', payload: 'Cet évènement n\'existe pas, veuillez réessayer.' });
    }
    const eventData = await response.json();
    dispatch({ type: 'fetch', payload: eventData });
    dispatch({ type: 'clearError' });

    return {
        name: eventData.name,
        slug: eventData.slug,
        persons: eventData.persons,
        expenses: eventData.expenses,
    };
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
                slug: slugify(action.payload.name.toString()),
                isCreating: true,
            };
        }

        case 'fetch':
            return { ...item, ...action.payload, isCreating: false };
        case 'error':
            return { error: action.payload, isCreating: false };
        case 'clearError':
            return { ...item, error: null };
        case 'creationComplete':
            return { ...item, isCreating: false };
        default:
            throw new Error(`Unknown action: ${action.type}`);
    }
}