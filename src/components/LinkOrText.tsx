import { Text, type TextProps } from "@mantine/core";
import Link from "next/link";

type ILinkOrText = {
  text: string;
} & TextProps;

const LinkOrText: React.FC<ILinkOrText> = ({ text, ...textProps }) => {
  const match = text.match(/^(https?:\/\/[^\s]+)/);
  if (match) {
    return (
      <Link href={text}>
        <Text {...textProps}>{text}</Text>
      </Link>
    );
  } else {
    return <Text {...textProps}>{text}</Text>;
  }
};

export default LinkOrText;
