import { Box } from "@mui/material";
import copy from "copy-to-clipboard";
import { useToasts } from "@/hooks/useToasts";
import { useState } from "react";

export default function CopyToClipboard(props: {
  value: string;
  children: any;
}) {
  const { value, children } = props;
  const { showSuccessToast } = useToasts();
  const [isCopied, setIsCopied] = useState(false);
  const handleCopy = (text: string) => {
    copy(text);
    setIsCopied(true);
    showSuccessToast("Successfully copied.");
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  return <Box onClick={() => handleCopy(value)}>{children}</Box>;
}
