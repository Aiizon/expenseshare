import {
    useEvent,
    useEventDispatch,
    fetchEvent,
    addPersonToEvent,
    addExpenseToEvent,
    updatePaidStatus
} from "../context/EventProvider.jsx";
import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {Formik} from "formik";

export default function Details() {
    const apiUrl = import.meta.env.VITE_API_URL;
    const dispatch = useEventDispatch();
    const event = useEvent();
    const {slug} = useParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [categories, setCategories] = useState([]);

    const getEvent = async () => {
        await fetchEvent(dispatch, slug);
        if (event.error) {
            navigate('/');
        }
    };

    const getCategories = async () => {
        const response = await fetch(`${apiUrl}/categories`);
        const data = await response.json();
        setCategories(data.member);
    };

    useEffect(() => {
        setTimeout(() => {
            getEvent();
            getCategories();
            setIsLoading(false);
        }, 1000);
    }, []);

    const displayAddPersonModal = () => {
        const modal = document.getElementById('addPersonModal');
        modal.classList.toggle('hidden');
    };

    const displayAddExpenseModal = () => {
        const modal = document.getElementById('addExpenseModal');
        modal.classList.toggle('hidden');
    }

    const handlePaidStatusChange = async e => {
        const id = e.target.id;
        const checked = e.target.checked;
        const expense = event.expenses.find(expense => id === expense['@id']);
        await updatePaidStatus(dispatch, expense, checked);
    }

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
                        <button className='size-10 bg-green-500 hover:bg-green-800 cursor-pointer text-white p-2 rounded-md' onClick={displayAddPersonModal}>+</button>
                    </div>
                    <div id='addPersonModal' className='hidden'>
                        <Formik
                            initialValues={{firstName: '', lastName: '', event: `${apiUrl}/events/${slug}`}}
                            onSubmit={async (values, {setSubmitting}) => {
                                await addPersonToEvent(dispatch, values);
                                setSubmitting(false);
                            }}
                            validate={
                                values => {
                                    const errors = {};
                                    if (!values.firstName) {
                                        errors.firstName = 'Veuillez renseigner un prénom.';
                                    }
                                    if (!values.lastName) {
                                        errors.lastName = 'Veuillez renseigner un nom.';
                                    }
                                    return errors;
                                }
                            }
                        >
                            {({
                                  values,
                                  errors,
                                  touched,
                                  handleChange,
                                  handleBlur,
                                  handleSubmit,
                                  isSubmitting
                            }) => (
                                <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                                    <input type='text' name='firstName' placeholder='Prénom' onChange={handleChange} onBlur={handleBlur} value={values.firstName} className='p-2 rounded-md'/>
                                    {errors.firstName && touched.firstName && <p className='text-red-500'>{errors.firstName}</p>}
                                    <input type='text' name='lastName' placeholder='Nom' onChange={handleChange} onBlur={handleBlur} value={values.lastName} className='p-2 rounded-md'/>
                                    {errors.lastName && touched.lastName && <p className='text-red-500'>{errors.lastName}</p>}
                                    <button type='submit' disabled={isSubmitting} className='bg-green-500 hover:bg-green-800 cursor-pointer text-white p-2 rounded-md'>Ajouter</button>
                                </form>
                            )}
                        </Formik>
                    </div>
                    <div className='flex flex-row justify-evenly gap-4'>
                        <ul>
                            {event.persons.map(person => {
                                return (
                                    <li key={person.id}>{person.firstName} {person.lastName}</li>
                                );
                            })}
                        </ul>
                    </div>
                </div>
                <hr className='grow bg-gray-300 h-0.5'/>
                <div className='flex flex-col gap-4'>
                    <div className='flex flex-col justify-evenly'>
                        <h2 className='text-2xl'>Dépenses</h2>
                        <button className='size-10 bg-green-500 hover:bg-green-800 cursor-pointer text-white p-2 rounded-md' onClick={displayAddExpenseModal}>+</button>
                    </div>
                    <div id="addExpenseModal" className="hidden">
                        <Formik
                            initialValues={{
                                title: '',
                                amount: 0,
                                paid: false,
                                person: '',
                                category: '',
                                event: `${apiUrl}/events/${slug}`,
                                createdAt: new Date().toISOString(),
                                updatedAt: new Date().toISOString()}
                            }
                            onSubmit={async (values, {setSubmitting}) => {
                                const newItem = {
                                    ...values,
                                    amount: values.amount.toString(),
                                    person: `${apiUrl}/people/` + values.person,
                                    category: `${apiUrl}/categories/` + values.category,
                                };
                                await addExpenseToEvent(dispatch, newItem);
                                setSubmitting(false);
                            }}
                            validate={
                                values => {
                                    const errors = {};
                                    if (!values.title) {
                                        errors.title = 'Veuillez renseigner un titre.';
                                    }
                                    if (0 === values.amount) {
                                        errors.amount = 'Veuillez renseigner un montant.';
                                    }
                                    if (!values.person) {
                                        errors.person = 'Veuillez renseigner une personne.';
                                    }
                                    if (!values.category) {
                                        errors.category = 'Veuillez renseigner une catégorie.';
                                    }
                                    return errors;
                                }
                            }
                        >
                            {({
                                  values,
                                  errors,
                                  touched,
                                  handleChange,
                                  handleBlur,
                                  handleSubmit,
                                  isSubmitting
                            }) => (
                                <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                                    <input type='text' name='title' placeholder='Titre' onChange={handleChange} onBlur={handleBlur} value={values.title} className='p-2 rounded-md'/>
                                    {errors.title && touched.title && <p className='text-red-500'>{errors.title}</p>}
                                    <input type='number' name='amount' placeholder='Montant' onChange={handleChange} onBlur={handleBlur} value={values.amount} className='p-2 rounded-md'/>
                                    {errors.amount && touched.amount && <p className='text-red-500'>{errors.amount}</p>}
                                    <select name='person' onChange={handleChange} onBlur={handleBlur} value={values.person} className='p-2 rounded-md'>
                                        <option value=''>Choisir une personne</option>
                                        {event.persons.map((person, index) => {
                                            return (
                                                <option key={index} value={person.id}>{person.firstName} {person.lastName}</option>
                                            );
                                        })}
                                    </select>
                                    {errors.person && touched.person && <p className='text-red-500'>{errors.person}</p>}
                                    <select name='category' onChange={handleChange} onBlur={handleBlur} value={values.category} className='p-2 rounded-md'>
                                        <option value=''>Choisir une catégorie</option>
                                        {categories?.map((category, index) => {
                                            return (
                                                <option key={index} value={category.id}>{category.name}</option>
                                            );
                                        })}
                                    </select>
                                    {errors.category && touched.category && <p className='text-red-500'>{errors.category}</p>}
                                    <button type='submit' disabled={isSubmitting} className='bg-green-500 hover:bg-green-800 cursor-pointer text-white p-2 rounded-md'>Ajouter</button>
                                </form>
                            )}
                        </Formik>
                    </div>
                    <div className='flex flex-row justify-evenly gap-4'>
                        <ul>
                            {event.expenses.map(expense => {
                                return (
                                    <li key={expense.id} className='flex flex-row gap-1'>
                                        <input type='checkbox' id={expense['@id']} checked={expense.paid} onChange={handlePaidStatusChange}/>
                                        {expense.title} ({expense.person.firstName} {expense.person.lastName}) - {expense.amount}€
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}