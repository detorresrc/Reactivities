import useErrorStore from "@/store/features/error"
import { Container, Header, Segment } from "semantic-ui-react";

const ServerError = () => {
  const { error } = useErrorStore();

  return (
    <Container>
      <Header as="h1" content="Server Error"></Header>
      <Header sub as='h5' color="red" content={error?.message}></Header>
      {error?.details && (
        <Segment>
          <Header as='h4' content='Stack trace' color="teal" />
          <code style={{marginTop: '10px'}}>{error.details}</code>
        </Segment>
      )}
    </Container>
  )
}

export default ServerError