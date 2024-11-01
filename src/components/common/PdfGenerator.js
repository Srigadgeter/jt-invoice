import React, { useEffect, useRef } from "react";
import { usePDF, Resolution } from "react-to-pdf";

const PdfGenerator = ({ Template, filename, dataId, setTrigger, getRef }) => {
  const ref = useRef();

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

  useEffect(() => {
    getRef(ref);
    targetRef.current = ref.current;
  }, [ref]);

  return <Template reference={ref} dataId={dataId} />;
};

export default PdfGenerator;
