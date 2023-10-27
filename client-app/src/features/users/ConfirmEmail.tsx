import agent from "@/lib/agent";
import { useQuery } from "@/lib/hooks/common";
import useModalStore from "@/store/features/modal";
import { useEffect, useRef, useState } from "react";
import { Button, Header, Icon, Segment } from "semantic-ui-react";
import LoginForm from "../auth/LoginForm";

const ConfirmEmail = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { openModal } = useModalStore();
  const email = useQuery().get('email') as string;
  const token = useQuery().get('token') as string;

  const Statuses = {
    Verifying: "Verifying",
    Failed: "Failed",
    Success: "Success"
  };

  const [status, setStatus] = useState(Statuses.Verifying);

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

  const initialized = useRef(false)
  
  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true

      agent.Account.verifyEmail(token, email)
        .then(_ => {
          setStatus(Statuses.Success);
        }).catch(_ => {
          setStatus(Statuses.Failed);
        });
    }
  }, []);

  const getBody = () => {
    switch(status){
      case Statuses.Verifying:
        return <p>Veriying...</p>
      case Statuses.Failed:
        return <div>
                <p>Verifying failed. You can try resending the verification link to your email.</p>
                <Button loading={isLoading} primary onClick={handleConfirmEmailResend} content="Resend Email" size="huge"/>
              </div>
      case Statuses.Success:
        return <div>
                <p>Email has been verified- you can now login.</p>
                <Button primary onClick={() => openModal(<LoginForm/>)} content="Login"/>
              </div>
    }
  }

  return (
    <Segment placeholder textAlign="center">
      <Header>
        <Icon name="envelope"/>
        Email verification
      </Header>
      <Segment.Inline>
        {getBody()}
      </Segment.Inline>
    </Segment>
  )
}

export default ConfirmEmail