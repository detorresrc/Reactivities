import API from "@/lib/api";
import { useState } from "react";
import {Button, Header, Segment} from "semantic-ui-react";
import ValidationError from "./ValidationError";

export default function TestError() {
    const [errors, setErrors] = useState<string[]>([]);

    function handleNotFound() {
        API.get('buggy/not-found').catch(err => console.log(err.response));
    }

    function handleBadRequest() {
        API.get('buggy/bad-request').catch(err => console.log(err.response));
    }

    function handleServerError() {
        API.get('buggy/server-error').catch(err => console.log(err.response));
    }

    function handleUnauthorised() {
        API.get('buggy/unauthorised').catch(err => console.log(err.response));
    }

    function handleBadGuid() {
        API.get('activities/notaguid').catch(err => console.log(err.response));
    }

    function handleValidationError() {
        API.post('activities', {}).catch(err => setErrors(err));
    }

    return (
        <>
            <Header as='h1' content='Test Error component' />
            <Segment>
                <Button.Group widths='7'>
                    <Button onClick={handleNotFound} content='Not Found' basic primary />
                    <Button onClick={handleBadRequest} content='Bad Request' basic primary />
                    <Button onClick={handleValidationError} content='Validation Error' basic primary />
                    <Button onClick={handleServerError} content='Server Error' basic primary />
                    <Button onClick={handleUnauthorised} content='Unauthorised' basic primary />
                    <Button onClick={handleBadGuid} content='Bad Guid' basic primary />
                </Button.Group>
            </Segment>
            {errors && <ValidationError errors={errors} />}
        </>
    )
}
