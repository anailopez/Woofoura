import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { thunkAddQuestion } from '../../store/questions';

const CreateQuestionForm = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState('');
    const [validationErrors, setValidationErrors] = useState([]);
    const [hasSubmitted, setHasSubmitted] = useState(false);

    const ownerId = useSelector(state => state.session.user.id)

    const dispatch = useDispatch();

    useEffect(() => {
        const errors = [];

        if (!title.length) {
            errors.push('Please make a title for your question!')
        }

        setValidationErrors(errors);
    }, [title]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setHasSubmitted(true);

        if (validationErrors.length > 0) {
            return alert("Oops! Please fix errors with your question!");
        }

        const newQuestion = {
            ownerId: ownerId,
            title,
            description,
            image
        };

        const question = await dispatch(thunkAddQuestion(newQuestion));
        console.log('after dispatch, from component', question)
        //NOT WORKING?
        if (question) {
            reset();
        }
    };

    const reset = () => {
        setTitle('');
        setDescription('');
        setImage('');
        setValidationErrors([]);
        setHasSubmitted(false);
    };

    return (
        <div>
            <h1>Post a new question!</h1>
            <ul>
                {hasSubmitted && validationErrors.length > 0 && validationErrors.map(error => (
                    <li key={error}>{error}</li>
                ))}
            </ul>
            <form onSubmit={handleSubmit}>
                <label>Title</label>
                <input
                    type='text'
                    onChange={(e) => setTitle(e.target.value)}
                    value={title}
                    placeholder='Title'
                    name='title'
                />
                <label>Description</label>
                <textarea
                    onChange={(e) => setDescription(e.target.value)}
                    value={description}
                    name='description'
                    placeholder='Description'
                    rows='10'
                />
                <label>Image</label>
                <input
                    type='text'
                    onChange={(e) => setImage(e.target.value)}
                    value={image}
                    placeholder='Image URL'
                    name='image'
                />
                <button type='submit'>Post your question</button>
            </form>
        </div>
    )
}

export default CreateQuestionForm;
