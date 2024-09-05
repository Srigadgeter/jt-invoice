import React, { useEffect } from "react";
import { usePDF, Resolution } from "react-to-pdf";

const PdfGenerator = ({ Template, filename, dataId, setTrigger }) => {
  const options = {
    filename,
    page: {
      margin: 12
    },
    resolution: Resolution.HIGH
  };

  const { toPDF, targetRef } = usePDF(options);

  useEffect(() => {
    setTrigger(() => toPDF);
  }, []);

  return <Template reference={targetRef} dataId={dataId} />;
};

export default PdfGenerator;
