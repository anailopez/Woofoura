import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { thunkGetAllQuestions } from '../../store/questions';
import { thunkDeleteQuestion } from '../../store/questions';
import { thunkGetAllAnswers } from '../../store/answers';
import EditQuestionForm from '../EditQuestionForm';
import AllAnswers from '../AllAnswers';
import './AllQuestions.css';

const AllQuestions = () => {
    const [showEditForm, setShowEditForm] = useState(false);
    const [buttonId, setButtonId] = useState(null);

    const dispatch = useDispatch();

    const questionsArr = useSelector(state => state.questionDetail.questionsReducer.orderedQuestions);
    const userId = useSelector(state => state.session.user.id);

    useEffect(() => {
        dispatch(thunkGetAllQuestions());
        dispatch(thunkGetAllAnswers());
    }, [dispatch]);


    return (
        <div className='allQuestions'>
            {questionsArr && questionsArr.map(question => (
                <div key={question.id} className='allquestions-content' >
                    {question.User && (
                        <div className='user-display'>
                            {question.User.icon && (
                                <img src={question.User.icon} alt='icon' />
                            )}
                            <h3>{question.User.username} asks:</h3>
                        </div>
                    )}
                    <div className='question-content'>
                        <h2>{question.title}</h2>
                        <p>{question.description}</p>
                        {question.image && (
                            <img src={question.image} />
                        )}
                        {question.User && showEditForm && question.User.id === userId && buttonId === question.id && (
                            <div className='edit-question-form-area'>
                                <EditQuestionForm questionId={question.id} showEditForm={showEditForm} setShowEditForm={setShowEditForm} />
                                <button onClick={() => setShowEditForm(false)}>Cancel Changes</button>
                            </div>
                        )}
                        {question.User && question.ownerId === userId && !showEditForm && (
                            <div className='edit-delete-buttons'>
                                <button id={buttonId} onClick={(e) => { setShowEditForm(true); setButtonId(question.id) }}>
                                    <i className="fa-solid fa-pen" />
                                    Edit Question
                                </button>
                                <button onClick={() => { dispatch(thunkDeleteQuestion(question.id)); dispatch(thunkGetAllQuestions()) }}>
                                    <i className="fa-solid fa-trash-can" />
                                    Delete Question
                                </button>
                            </div>
                        )}
                    </div>
                    <div className='allanswers-content'>
                        <AllAnswers question={question} />
                    </div>
                </div>
            ))}
        </div>
    )
}

export default AllQuestions;
