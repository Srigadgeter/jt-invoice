import * as yup from "yup";

import { COMPANY_ADDRESS_MAX_LEN, COMPANY_ADDRESS_MIN_LEN } from "utils/constants";

// Schema for each address entry in the Profile page
const profileAddressSchema = yup.object({
  addresses: yup.array().of(
    yup.object({
      address: yup
        .string()
        .required("Address is required")
        .min(
          COMPANY_ADDRESS_MIN_LEN,
          `Address must be at least ${COMPANY_ADDRESS_MIN_LEN} characters`
        )
        .max(
          COMPANY_ADDRESS_MAX_LEN,
          `Address should not be more than ${COMPANY_ADDRESS_MAX_LEN} characters`
        )
        .trim(),
      effectiveFrom: yup.string().required("Effective from date is required").trim()
    })
  )
});

export default profileAddressSchema;
