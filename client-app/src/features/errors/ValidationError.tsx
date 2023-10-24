import { FC } from "react";
import { Message } from "semantic-ui-react";

type Props = {
  errors: string[]
};

const ValidationError:FC<Props> = ({errors}) => {
  if(errors.length==0) return <></>;
  
  return (
    <Message negative={true}>
      {errors && (
        <Message.List>
          {errors.map((error: string, i) => (
            <Message.Item key={i}>{error}</Message.Item>
          ))}
        </Message.List>
      )}
    </Message>
  )
}

export default ValidationError