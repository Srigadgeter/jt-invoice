import * as yup from "yup";

import { EXTRA_REASON_MAX_LEN, EXTRA_REASON_MIN_LEN } from "utils/constants";

// Schema for the AddEditExtraModal component in the Invoice page
const addEditExtraSchema = yup.object({
  reason: yup.object({
    label: yup.string().trim(),
    value: yup.string().trim().required("Reason is required")
  }),
  newReason: yup.string().when("reason.value", {
    is: "new",
    then: (schema) =>
      schema
        .required("New Reason is required")
        .min(EXTRA_REASON_MIN_LEN, `New Reason must be at least ${EXTRA_REASON_MIN_LEN} characters`)
        .max(
          EXTRA_REASON_MAX_LEN,
          `New Reason should not be more than ${EXTRA_REASON_MAX_LEN} characters`
        )
        .trim()
  }),
  amount: yup.number().required("Amount is required").positive("Amount must be a positive number")
});

export default addEditExtraSchema;
