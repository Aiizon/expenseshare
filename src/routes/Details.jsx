import {useEvent, useEventDispatch, fetchEvent, addPersonToEvent} from "../context/EventProvider.jsx";
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

    const fetch = async () => {
        await fetchEvent(dispatch, slug);
        if (event.error) {
            navigate('/');
        }
        setIsLoading(false);
    }

    useEffect(() => {
        fetch();
    }, []);

    const displayAddPersonModal = () => {
        const modal = document.getElementById('addPersonModal');
        modal.classList.toggle('hidden');
    };

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
                            {event.persons.map((person, index) => {
                                return (
                                    <li key={index}>{person.firstName} {person.lastName}</li>
                                );
                            })}
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
                            {event.expenses.map((expense, index) => {
                                return (
                                    <li key={index}>{expense.title} - {expense.amount}€</li>
                                );
                            })}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}