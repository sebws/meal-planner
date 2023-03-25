import { type NextPage } from "next";
import { Container, Timeline } from "@mantine/core";
import { api } from "~/utils/api";

const Home: NextPage = () => {

  return (
    <Container>
      <Timeline>
        <Timeline.Item title="Monday"></Timeline.Item>
        <Timeline.Item title="Tuesday"></Timeline.Item>
        <Timeline.Item title="Wednesday"></Timeline.Item>
        <Timeline.Item title="Thursday"></Timeline.Item>
        <Timeline.Item title="Friday"></Timeline.Item>
        <Timeline.Item title="Saturday"></Timeline.Item>
        <Timeline.Item title="Sunday"></Timeline.Item>
      </Timeline>
    </Container>
  );
};

export default Home;
