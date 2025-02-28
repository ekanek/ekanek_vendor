import {
  Box,
  Layout,
  TextField,
  Button,
  Form,
  FormLayout,
  Page,
  Select,
  DropZone,
  LegacyStack,
  Thumbnail,
  Text,
} from "@shopify/polaris";
import { useState, useReducer, useEffect, useCallback } from "react";
import { useFetcher } from "@remix-run/react";
import {NoteIcon} from '@shopify/polaris-icons';
import { authenticate } from "../shopify.server";
import { json } from "@remix-run/react";
import axios from "axios";

const states = [
  { label: "Delhi", value: "delhi" },
  { label: "Haryana", value: "haryana" },
  { label: "Maharashtra", value: "maharashtra" },
  { label: "Karnataka", value: "karnataka" },
];

const initialState = {
  personalDetails: {},
  businessDetails: {},
  bankDetails: {},
  attachments: {},
};

function formReducer(state, action) {
  return {
    ...state,
    [action.section]: {
      ...state[action.section],
      [action.field]: action.value,
    },
  };
}

const validImageTypes = ['image/gif', 'image/jpeg', 'image/png'];

export async function action({ request }) {
  const formData = await request.formData();
  const { session } = await authenticate.admin(request);
  const { accessToken } = session;

  const data = new FormData();

  formData.forEach((value, key) => {
    data.append(`${key}`, value);
  });
  
    const response = await axios.post(
      "https://76ff-122-176-112-186.ngrok-free.app/ekstore_sales_channel/ekstore_registered_vendors",
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          "X-Shopify-Access-Token": accessToken,
        },
      }
    );
  
    console.log("Response status:", response.status);
    console.log("Response data:", response.data);
  } 
export default function Registration() {
  const [currentStep, setCurrentStep] = useState(0);
  const [state, dispatch] = useReducer(formReducer, initialState);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const fetcher = useFetcher();

  const validateStep = () => {
    const currentFields = stepsConfig[currentStep].fields;
    const section = stepsConfig[currentStep].section;
    let newErrors = {};

    currentFields.forEach(({ field, type, required }) => {
      if (required) {
        if (!state[section][field] || state[section][field] === "") {
          newErrors[field] = "This field is required";
        } else if (type === "file" && !state[section][field]) {
          newErrors[field] = "Please upload a file";
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleChange = (section, field) => (value) => {
    dispatch({ section, field, value });
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  const handleFileUpload = useCallback((section, field, file) => {
    dispatch({ section, field, value: file });
  }, []);

  const handleSubmit = async () => {
    if (!validateStep()) return;
    setLoading(true);
    setErrors(null);

    const formData = new FormData();

  Object.keys(state).forEach((section) => {
    Object.keys(state[section]).forEach((field) => {
      const value = state[section][field];

      // Append files correctly
      if (value instanceof File) {
        formData.append(`ekstore_registered_vendor[${field}]`, value);
      } else {
        formData.append(`ekstore_registered_vendor[${field}]`, value);
      }
    });
  });

  fetcher.submit(formData, { method: "post", encType: "multipart/form-data" });
  setLoading(false);
  };

  const stepsConfig = [
    {
      title: "Personal Details",
      section: "personalDetails",
      fields: [
        { label: "Email *", field: "email", type: "email", required: true },
        {
          label: "Legal Entity Name *",
          field: "legal_entity_name",
          required: true,
        },
        { label: "Contact Number *", field: "contact_number", required: true },
        {
          label: "Corporate Office Address *",
          field: "corporate_office_address",
          required: true,
        },
        {
          label: "Registered Office Address *",
          field: "registered_office_address",
          required: true,
        },
        {
          label: "Place of Supply Address *",
          field: "place_of_supply_address",
          required: true,
        },
      ],
    },
    {
      title: "Business Details",
      section: "businessDetails",
      fields: [
        { label: "PAN Number *", field: "pan_number", required: true },
        {
          label: "GST Registration Number *",
          field: "gst_registration_number",
          required: true,
        },
        { label: "Brand Website *", field: "brand_website", required: true },
        {
          label: "Shopify Shop Name *",
          field: "shopify_shop_name",
          required: true,
        },
        {
          label: "Shopify SPOC Email *",
          field: "shopify_spoc_email",
          required: true,
        },
        { label: "Brands *", field: "brands", required: true },
        {
          label: "State *",
          field: "state",
          type: "select",
          required: true,
        },
      ],
    },
    {
      title: "Bank Details",
      section: "bankDetails",
      fields: [
        { label: "Bank Name *", field: "bank_name", required: true },
        { label: "Branch Name *", field: "branch_name", required: true },
        {
          label: "Bank Account Number *",
          field: "bank_account_number",
          required: true,
        },
        {
          label: "Beneficiary Name *",
          field: "beneficiary_name",
          required: true,
        },
        { label: "IFSC Code *", field: "ifsc_code", required: true },
        {
          label: "Contact Person Name *",
          field: "contact_person_name",
          required: true,
        },
        { label: "Finance Email *", field: "finance_email_email", required: true },
      ],
    },
    {
      title: "Attachments",
      section: "attachments",
      fields: [
        {
          label: "PAN Card Copy *",
          field: "pan_card_copy",
          type: "file",
          required: true,
        },
        {
          label: "GST Certificate Copy *",
          field: "gst_certificate_copy",
          type: "file",
          required: true,
        },
        {
          label: "Cancelled Cheque *",
          field: "cancelled_cheque",
          type: "file",
          required: true,
        },
        {
          label: "MSME Certificate Copy",
          field: "msme_certificate_copy",
          type: "file",
          required: false,
        },
      ],
    },
  ];

  const currentStepConfig = stepsConfig[currentStep];

  return (
    <Layout>
      <Layout.Section fullWidth>
        <div
          style={{
            marginLeft: "20px",
            marginRight: "20px",
            padding: "20px",
            background: "white",
            borderRadius: "8px",
          }}
        >
          <h1
            style={{
              textAlign: "left",
              marginBottom: "20px",
              fontSize: "20px",
              fontWeight: "600",
              color: "#202223",
            }}
          >
            {currentStepConfig.title}
          </h1>
          <Form>
            <FormLayout>
              {currentStepConfig.fields.map(({ label, field, type }) =>
                type === "select" ? (
                  <Select
                    key={field}
                    label={label}
                    options={states}
                    value={state[currentStepConfig.section]?.[field] || ""}
                    onChange={handleChange(currentStepConfig.section, field)}
                    error={errors[field]}
                  />
                ) : type === "file" ? (
                  <div key={field} style={{ marginBottom: "10px" }}>
                    <DropZone
                      key={field}
                      allowMultiple={false}
                      label={label}
                      onDrop={(_dropFiles, acceptedFiles, _rejectedFiles) =>
                        handleFileUpload(
                          currentStepConfig.section,
                          field,
                          acceptedFiles[0],
                        )
                      }
                    >
                      {state[currentStepConfig.section]?.[field] && <LegacyStack>
                        <Thumbnail
                          size="small"
                          alt={state[currentStepConfig.section]?.[field]?.name}
                          source={
                            validImageTypes.includes(state[currentStepConfig.section]?.[field]?.type)
                              ? window.URL.createObjectURL(state[currentStepConfig.section]?.[field])
                              : NoteIcon
                          }
                        />
                        <div>
                          {state[currentStepConfig.section]?.[field]?.name}{" "}
                          <Text variant="bodySm" as="p">
                            {state[currentStepConfig.section]?.[field]?.size} bytes
                          </Text>
                        </div>
                      </LegacyStack>}
                      <DropZone.FileUpload actionTitle={`${state[currentStepConfig.section]?.[field] ? 'Change' : 'Add'} File`} />
                    </DropZone>

                    {/* Show Validation Error if Any */}
                    {errors && errors[field] && (
                      <p style={{ color: "red", marginTop: "5px" }}>
                        {errors[field]}
                      </p>
                    )}
                  </div>
                ) : (
                  <TextField
                    key={field}
                    label={label}
                    value={state[currentStepConfig.section]?.[field] || ""}
                    onChange={handleChange(currentStepConfig.section, field)}
                    type={type || "text"}
                    fullWidth
                    error={errors[field]}
                  />
                ),
              )}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "20px",
                }}
              >
                {currentStep > 0 && (
                  <Button onClick={handlePrevious}>Previous</Button>
                )}
                {currentStep < stepsConfig.length - 1 ? (
                  <Button onClick={handleNext}>Next</Button>
                ) : (
                  <Button primary onClick={handleSubmit} loading={loading}>
                    Submit
                  </Button>
                )}
              </div>
            </FormLayout>
          </Form>
        </div>
      </Layout.Section>
    </Layout>
  );
}
