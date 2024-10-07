import {createContext, useContext, useReducer} from "react";
import slugify from "../utils/slugify.js";

const apiUrl = import.meta.env.VITE_API_URL;
export const EventContext = createContext(null);
const EventDispatchContext = createContext(null);

export function EventProvider({children}) {
    const [event, dispatch] = useReducer(eventReducer, {name: '', slug: '', persons: [], expenses: []});

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
    console.log(item);
    switch (action.type) {
        case 'create':
            {
                const newItem = {
                    ...item,
                    name: action.payload.name.toString(),
                    slug: slugify(action.payload.name.toString())
                };

                fetch(`${apiUrl}/events`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/ld+json',
                    },
                    body: JSON.stringify(newItem),
                });

                break;
            }
        default:
            throw new Error(`Unknown action: ${action.type}`);
    }
}