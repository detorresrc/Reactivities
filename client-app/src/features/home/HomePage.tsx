import useModalStore from "@/store/features/modal";
import useUserStore from "@/store/features/user";
import { Link } from "react-router-dom"
import { Container, Header, Segment, Image, Button, Divider } from "semantic-ui-react"
import LoginForm from "../auth/LoginForm";
import RegisterForm from "../auth/RegisterForm";
import FacebookLogin, { SuccessResponse } from "@greatsumini/react-facebook-login";

const HomePage = () => {
  const { user, facebookLogin, fbLoading } = useUserStore();
  const { openModal } = useModalStore();

  return (
    <Segment inverted textAlign="center" vertical className="masthead">
      <Container text>
        <Header as="h1" inverted>
          <Image size="massive" src="/assets/logo.png" style={{marginBottom: '12px'}} />
        </Header>
        
  
        {user == null ? (
          <>
            <Header as="h2" inverted content="Welcome to Reactiveties"></Header>
            <Button size="huge" inverted onClick={() => openModal(<LoginForm/>)}>
              Login
            </Button>
            <Button size="huge" inverted onClick={() => openModal(<RegisterForm/>)}>
              Register
            </Button>
            <Divider horizontal inverted>Or</Divider>
            <FacebookLogin
              appId="318592247467629"
              onSuccess={(response: SuccessResponse) => {
                facebookLogin(response.accessToken);
                console.log({response});
              }}
              className={`ui button facebook huge inverted ${fbLoading ? 'loading' : ''}`}
            />
          </>
        ) : (
          <>
            <Header as="h2" inverted content={`Welcome to ${user.displayName}`}></Header>
            <Button as={Link} to="/activities" size="huge" inverted>
              Go to Activities!
            </Button>
          </>
        )}
        
      </Container>
    </Segment>);
}

export default HomePage