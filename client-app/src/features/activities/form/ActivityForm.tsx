import { Button, Header, Segment } from "semantic-ui-react";
import { useState } from "react";

import useActivityStore from "@/store/features/activity";
import { useLoaderData, useNavigate, useNavigation } from "react-router-dom";

import { Formik, Form } from "formik";
import * as Yup from 'yup';

import TextInput from "@/app/common/form/TextInput";
import TextArea from "@/app/common/form/Textarea";
import SelectInput from "@/app/common/form/SelectInput";
import { categoryOptions } from "@/app/common/options/categoryOptions";
import DateInput from "@/app/common/form/DateInput";
import { Activity, ActivityFormValues } from "@/models/activity";

const ActivityForm = () => {
  const { addActivity, updateActivity } = useActivityStore();
  const data = useLoaderData() as {activity?: Activity};
  const { state } = useNavigation();
  const navigate = useNavigate();

  const [activity] = useState<ActivityFormValues>(new ActivityFormValues(data?.activity));

  const validationSchema = Yup.object({
    title      : Yup.string().required('Title is required'),
    description: Yup.string().required('Description is required'),
    category   : Yup.string().required('Category is required'),
    date       : Yup.string().required('Date is required').nullable(),
    city       : Yup.string().required('City is required'),
    venue      : Yup.string().required('Venue is required'),
  });

  const handleCancel = () => {
    if(activity.id)
      navigate(`/activities/${activity.id}`);
    else
      navigate('/activities');
  };

  if(state=='loading') return <div>Loading..</div>

  const handleFormSubmit = (activity: ActivityFormValues) => {
    try{
      if(activity && activity.id)
        updateActivity(activity).then(res => redirect(res?.id as string || ''));
      else
        addActivity(activity).then(res => redirect(res?.id as string || ''));
    }catch(error){
      console.log(error);
    }
  }

  const redirect = (id: string) => {
    navigate(`/activities/${id}`);
  }

  return (
    <Segment clearing>
      <Formik 
        initialValues={activity} 
        validationSchema={validationSchema}
        onSubmit={(values) => {handleFormSubmit(values)}}
        >
        {({handleSubmit, isValid, isSubmitting, dirty}) => (
        <Form className="ui form" onSubmit={handleSubmit} autoComplete='off'>
          <Header content="Activity Details" sub color="teal" />
          <TextInput name="title" placeholder="Title"/>
          <TextArea
            rows={3}
            placeholder='Description'
            name='description'
          />
          <SelectInput
            placeholder='-- Select Category --'
            name='category'
            options={categoryOptions}
          />
          <DateInput
            placeholderText='Date'
            name='date'
            showTimeSelect
            timeCaption="time"
            dateFormat={'MMMM d, yyyy h:mm aa'}
            />

          <Header content="Location Details" sub color="teal" />
          <TextInput
            placeholder='City'
            name='city'
            />
          <TextInput
            placeholder='Venue'
            name='venue'
            />

          <Button floated='right' positive type='submit' content='Submit' loading={isSubmitting}
            disabled={isSubmitting || !dirty || !isValid}
            />
          <Button
            floated='right'
            type='button'
            content='Cancel'
            loading={isSubmitting}
            onClick={handleCancel}
          />

        </Form>
        )}
      </Formik>
    </Segment>
  );
};

ActivityForm.loader = async ({params}: any) => {
  const activity = await useActivityStore.getState().loadActivity(params.id);

  return {
    activity
  }
}

export default ActivityForm;
