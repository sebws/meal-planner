import { type MantineTheme } from "@mantine/core";

export const groupBy = <T>(
  array: T[],
  predicate: (value: T, index: number, array: T[]) => string
) =>
  array.reduce((acc, value, index, array) => {
    (acc[predicate(value, index, array)] =
      acc[predicate(value, index, array)] || []).push(value);
    return acc;
  }, {} as { [key: string]: T[] });

export const minimalInputStyle = (theme: MantineTheme) => ({
  rightSection: {
    display: "none",
  },
  input: {
    padding: "0",
    fontSize: theme.fontSizes.sm,
    backgroundColor: "transparent",
    border: "none",
    textUnderlineOffset: "0.4em",
    "&:focus": {
      textDecoration: "underline",
    },
    textOverflow: "ellipsis",
    fontWeight: 400,
  },
  wrapper: {
    padding: 0,
    backgroundColor: "transparent",
  },
});
