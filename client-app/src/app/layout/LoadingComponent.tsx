import { FC } from "react";
import { Dimmer, Loader, Segment } from "semantic-ui-react";

type Props = {
  content?: string;
};

const LoadingComponent: FC<Props> = ({
  content = "Loading...",
}) => {
  return (
    <Dimmer as={Segment} blurring dimmed={true}>
      <Loader>
      {content}
      </Loader>
    </Dimmer>
  );
};

export default LoadingComponent;
