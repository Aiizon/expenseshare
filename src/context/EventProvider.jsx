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

export async function createEvent(dispatch, name) {
    const newItem = {name: name, slug: slugify(name)};
    if (name) {
        const response = await fetch(`${apiUrl}/events`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/ld+json',
            },
            body: JSON.stringify(newItem),
        });
        const eventData = await response.json();
        dispatch({
            type: 'fetch', payload: {
                name: eventData.name,
                slug: eventData.slug,
                persons: eventData.persons,
                expenses: eventData.expenses,
            }
        });
    }
}

export async function fetchEvent(dispatch, name) {
    const slug = slugify(name);
    const response = await fetch(`${apiUrl}/events/${slug}`);
    if (404 === response.status) {
        return dispatch({type: 'error', payload: 'Cet évènement n\'existe pas, veuillez réessayer.'});
    }
    const eventData = await response.json();
    dispatch({
        type: 'fetch', payload: {
            name: eventData.name,
            slug: eventData.slug,
            persons: eventData.persons,
            expenses: eventData.expenses,
        }
    });
    dispatch({type: 'clearError'});
}

export async function addPersonToEvent(dispatch, person) {
    try {
        const response = await fetch(`${apiUrl}/people`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/ld+json',
            },
            body: JSON.stringify(person),
        });

        const personData = await response.json();
        dispatch({type: 'addPerson', payload: personData.url})
    } catch (e) {
        console.error(`Error adding person: ${e}`);
    }
}

export async function addExpenseToEvent(dispatch, expense) {
    console.log('entering addExpense function');
    console.log(`calling "${apiUrl}/expenses"`);
    console.log(`expense: ${JSON.stringify(expense)}`);
    try {
        const response = await fetch(`${apiUrl}/expenses`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/ld+json',
            },
            body: JSON.stringify(expense),
        });

        const expenseData = await response.json();
        console.log(`expenseData: ${JSON.stringify(expenseData)}`);
    } catch (e) {
        console.error(`Error adding expense: ${e}`);
    }
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
            return {...item, ...action.payload};
        case 'fetch':
            return {...item, ...action.payload};
        case 'addPerson':
            return {...item, persons: [...item.persons, action.payload]};
        case 'error':
            return {error: action.payload};
        case 'clearError':
            return {...item, error: null};
        default:
            throw new Error(`Unknown action: ${action.type}`);
    }
}