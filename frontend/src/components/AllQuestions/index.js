import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { thunkGetAllQuestions } from '../../store/questions';
import { thunkGetAllAnswers } from '../../store/answers';
import { thunkDeleteQuestion } from '../../store/questions';
import { thunkDeleteAnswer } from '../../store/answers';
import EditQuestionForm from '../EditQuestionForm';
import AllAnswers from '../AllAnswers';
import './AllQuestions.css';

const AllQuestions = () => {
    const [showEditForm, setShowEditForm] = useState(false);
    const [showAnswers, setShowAnswers] = useState(false);
    const [buttonId, setButtonId] = useState(null);
    const [answerButtonId, setAnswerButtonId] = useState(null);

    const dispatch = useDispatch();

    const questionsArr = useSelector(state => state.questionDetail.questionsReducer.orderedQuestions);
    const userId = useSelector(state => state.session.user.id);

    const answers = useSelector(state => Object.values(state.questionDetail.answers));

    useEffect(() => {

        dispatch(thunkGetAllQuestions());
        dispatch(thunkGetAllAnswers());
    }, [dispatch]);


    const handleDelete = (question) => {
        const answer = answers.find(answer => answer.questionId === question.id);

        if (answer) {
            dispatch(thunkDeleteAnswer(answer.id));
        }

        dispatch(thunkDeleteQuestion(question.id));
    }



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
                            <img src={question.image} alt="question" />
                        )}
                        {question.User && showEditForm && question.User.id === userId && buttonId === question.id && (
                            <div>
                                <div>
                                    <EditQuestionForm questionId={question.id} showEditForm={showEditForm} setShowEditForm={setShowEditForm} />
                                    <button onClick={() => setShowEditForm(false)}>Cancel Changes</button>
                                </div>
                            </div>
                        )}
                        {question.User && question.ownerId === userId && !showEditForm && (
                            <div className='edit-delete-buttons'>
                                <button id={buttonId} onClick={(e) => { setShowEditForm(true); setButtonId(question.id) }}>
                                    <i className="fa-solid fa-pen" /> Edit Question
                                </button>
                                <button onClick={() => {
                                    handleDelete(question);
                                    dispatch(thunkGetAllQuestions());
                                    dispatch(thunkGetAllAnswers());
                                    setShowAnswers(false);
                                }}>
                                    <i className="fa-solid fa-trash-can" /> Delete Question
                                </button>
                            </div>
                        )}
                    </div>
                    <div className='allanswers-content'>
                        {!showAnswers && (
                            <button onClick={() => { setShowAnswers(true); setAnswerButtonId(question.id) }}>
                                <i className="fa-solid fa-comments" /> See Answers
                            </button>
                        )}
                        {showAnswers && answerButtonId === question.id && (
                            <>
                                <button onClick={() => setShowAnswers(false)}>
                                    <i className="fa-solid fa-comment-slash" /> Hide Answers
                                </button>
                                <AllAnswers question={question} />
                            </>
                        )}
                    </div>
                </div>
            ))}
        </div>
    )
}

export default AllQuestions;
