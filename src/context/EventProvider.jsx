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

export async function fetchEvent(dispatch, slug) {
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
            type: 'create', payload: {
                name: eventData.name,
                slug: eventData.slug,
                persons: eventData.persons,
                expenses: eventData.expenses,
            }
        });
    }
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
        dispatch({type: 'addPerson', payload: personData['@id']})
    } catch (e) {
        console.error(`Error adding person: ${e}`);
    }
}

export async function addExpenseToEvent(dispatch, expense) {
    try {
        const response = await fetch(`${apiUrl}/expenses`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/ld+json',
            },
            body: JSON.stringify(expense),
        });

        const expenseData = await response.json();
        dispatch({type: 'addExpense', payload: expenseData['@id']})
    } catch (e) {
        console.error(`Error adding expense: ${e}`);
    }
}

export async function updatePaidStatus(dispatch, expense, paid) {
    try {
        const response = await fetch(`${apiUrl}/expenses/${expense.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/merge-patch+json',
            },
            body: JSON.stringify({...expense, paid: paid, person: expense.person['@id']}),
        });

        const expenseData = await response.json();
        dispatch({type: 'setExpenseToPaid', payload: expenseData})
    } catch (e) {
        console.error(`Error setting expense to paid: ${e}`);
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
        case 'fetch':
            return {...item, ...action.payload};
        case 'create':
            return {...item, ...action.payload};
        case 'addPerson':
            return {...item, persons: [...item.persons, action.payload]};
        case 'addExpense':
            return {...item, expenses: [...item.expenses, action.payload]};
        case 'setExpenseToPaid':
            return {
                ...item,
                expenses: item.expenses.map(expense => {
                    if (expense.id === action.payload.id) {
                        return {...expense, paid: action.payload.paid};
                    }
                    return expense;
                })
            }
        case 'error':
            return {error: action.payload};
        case 'clearError':
            return {...item, error: null};
        default:
            throw new Error(`Unknown action: ${action.type}`);
    }
}