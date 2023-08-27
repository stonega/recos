"use client";

import { useEffect } from "react";
import { Crisp } from "crisp-sdk-web";

const CrispChat = () => {
  useEffect(() => {
    return Crisp.configure("9031c700-742f-43c6-869e-593de77a583c");
  }, []);

  return null;
};

export default CrispChat;
