import agent from "@/lib/agent";
import { useQuery } from "@/lib/hooks/common"
import { useState } from "react";
import { Button, Header, Icon, Segment } from "semantic-ui-react";

const RegistrationSuccess = () => {
  const [isLoading, setIsLoading] = useState(false);
  const email = useQuery().get('email') as string;

  const handleConfirmEmailResend = async () => {
    try{
      setIsLoading(true);
      await agent.Account.resendEmailConfirmation(email);
    }catch(error){
      console.log(error);
    }finally{
      setIsLoading(false);
    }
  }

  return (
    <Segment placeholder textAlign="center">
      <Header icon color='green'>
        <Icon name="check"/>
        Successfully registered!
      </Header>
      <p>Please check your email (including junk email) for the verification email.</p>
      {email && (
        <>
          <p>Didn't received the email?Click the belowbutton to resend.</p>
          <Button loading={isLoading} primary onClick={handleConfirmEmailResend} content="Resend Email" size="huge"/>
        </>
      )}
    </Segment>
  )
}

export default RegistrationSuccess