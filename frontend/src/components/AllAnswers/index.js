import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { thunkGetAllAnswers } from '../../store/answers';
import CreateAnswerForm from '../CreateAnswerForm';

const AllAnswers = ({ question }) => {
    const answersArr = useSelector(state => state.questionDetail.answers.orderedAnswers);
    const userId = useSelector(state => state.session.user.id);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(thunkGetAllAnswers());
    }, [dispatch]);


    return (
        <div>
            {question.ownerId !== userId && (
                <CreateAnswerForm question={question} />
            )}
            {answersArr && answersArr.map(answer => (
                <div key={answer.id}>
                        <div>
                            {answer.Question && question.id === answer.Question.id && (
                                <div>
                                    {answer.User && (
                                        <>
                                            <img src={answer.User.icon} alt="icon" />
                                            <h4>{answer.User.username} answered:</h4>
                                        </>
                                    )}
                                    <div className='answer-content'>
                                        <p>{answer.body}</p>
                                        {answer.image && (
                                            <img src={answer.image} />
                                        )}

                                    </div>
                                </div>
                            )}
                        </div>
                </div>
            ))}
        </div>
    )
}

export default AllAnswers;