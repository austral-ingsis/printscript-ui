// @ts-expect-error No defs for the following import:
import Snake from 'snake-game-react';
import {ReactNode, useEffect, useState} from "react";
import {Box, BoxProps} from "@mui/material";
import {snippetData} from "../../types/Snippet.ts";

type SnippetBoxProps = {
  code: string;
  children: ReactNode;
} & BoxProps

const SnippetBox = (props: SnippetBoxProps) => {
  const {code, children} = props;
  const [showBox, setShowBox] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      if (code.includes("snake_case_variable")) {
        setShowBox(true)
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [code]);

  return (
      <Box {...props}>
        {
          showBox ? (
              <Snake
                  {...snippetData}
              />
          ) : children
        }
      </Box>
  )


}

export const Bòx = SnippetBox
