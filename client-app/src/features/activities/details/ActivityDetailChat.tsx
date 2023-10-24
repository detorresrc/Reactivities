import { Field, FieldProps, Formik } from 'formik'
import { FC, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {Segment, Header, Comment, Form, Loader} from 'semantic-ui-react'
import * as Yup from 'yup';

import { Activity } from '@/models/activity'
import useCommentStore from '@/store/features/comment'
import { formatDistanceToNow } from 'date-fns';

type Props = {
    activity: Activity
}

const ActivityDetailChat:FC<Props> = ({activity}) => {
    const { comments, createHubConnection, clearComments, addComment } = useCommentStore();

    useEffect(() => {
        if(activity){
            createHubConnection(activity.id);
        }

        return () => {
            clearComments();
        }
    }, [activity]);

    return (
    <>
        <Segment
            textAlign='center'
            attached='top'
            inverted
            color='teal'
            style={{border: 'none'}}
        >
            <Header>Chat about this event</Header>
        </Segment>
            <Segment attached clearing>
                <Comment.Group>
                    <Formik
                        initialValues={{
                            body: ''
                        }}
                        onSubmit={(values, {resetForm}) => {
                                addComment({activityId: activity.id, body: values.body}).then(() => resetForm()) 
                            }
                        }
                        validationSchema={Yup.object({
                            body: Yup.string().required()
                        })}
                        >
                        {({handleSubmit, isSubmitting, isValid}) => (
                            <Form className='ui form' onSubmit={handleSubmit} autoComplete="off">
                                <Field name="body">
                                    {(props: FieldProps) => (
                                        <div style={{position: 'relative'}}>
                                            <Loader active={isSubmitting}/>
                                            <textarea
                                                placeholder='Enter your comment (Enter to submit, SHIFT + Enter for new line)'
                                                rows={2}
                                                {...props.field}
                                                onKeyPress={e => {
                                                    if(e.key == 'Enter' && e.shiftKey){
                                                        return;
                                                    }
                                                    if(e.key == 'Enter' && !e.shiftKey){
                                                        e.preventDefault();
                                                        isValid && handleSubmit();
                                                    }
                                                }}
                                            />
                                        </div>
                                    )}
                                </Field>
                            </Form>
                        )}
                    </Formik>

                    {comments.map(comment => (
                        <Comment key={comment.id}>
                            <Comment.Avatar src={comment.image || '/assets/user.png'}/>
                            <Comment.Content>
                                <Comment.Author as={Link} to={`/profiles/${comment.username}`}>{comment.displayName}</Comment.Author>
                                <Comment.Metadata>
                                    <div>{formatDistanceToNow(comment.createdAt)} ago</div>
                                </Comment.Metadata>
                                <Comment.Text style={{whiteSpace: 'pre-wrap'}}>{comment.body}</Comment.Text>
                                <Comment.Actions>
                                    <Comment.Action>Reply</Comment.Action>
                                </Comment.Actions>
                            </Comment.Content>
                        </Comment>
                    ))}

                </Comment.Group>
            </Segment>
        </>
    )
}

export default ActivityDetailChat