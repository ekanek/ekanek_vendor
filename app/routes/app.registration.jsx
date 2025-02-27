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
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { useState, useReducer, useEffect, useCallback } from "react";

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

export default function Registration() {
  const [currentStep, setCurrentStep] = useState(0);
  const [state, dispatch] = useReducer(formReducer, initialState);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateStep = () => {
    const currentFields = stepsConfig[currentStep].fields;
    const section = stepsConfig[currentStep].section;
    let newErrors = {};

    currentFields.forEach(({ field, type, required }) => {
      if (required) {
        if (!state[section][field] || state[section][field].trim() === "") {
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
    setLoading(true);
    setErrors(null);

    const formData = new FormData();
    Object.keys(state).forEach((section) => {
      Object.keys(state[section]).forEach((field) => {
        formData.append(field, state[section][field]);
      });
    });

    console.log(formData, '-----------');

    // try {
    //   const response = await fetch('https://3e43-122-176-112-186.ngrok-free.app/ekstore_sales_channel/ekstore_registered_vendors', {
    //     method: 'POST',
    //     body: formData
    //   });

    //   if (!response.ok) {
    //     throw new Error('Failed to submit form');
    //   }
    //   alert('Registration successful');
    // } catch (err) {
    //   setError(err.message);
    // } finally {
    //   setLoading(false);
    // }
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
          label: "Vendor State *",
          field: "vendor_state",
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
        { label: "Finance Email *", field: "finance_email", required: true },
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
                    {/* File Upload Label */}
                    <label
                      htmlFor={field}
                      style={{
                        fontWeight: "bold",
                        display: "block",
                        marginBottom: "5px",
                      }}
                    >
                      {label}
                    </label>

                    {/* DropZone Component */}
                    <DropZone
                      key={field}
                      onDrop={(files) =>
                        handleFileUpload(
                          currentStepConfig.section,
                          field,
                          files[0],
                        )
                      }
                    >
                      <DropZone.FileUpload />
                    </DropZone>

                    {/* Show Validation Error if Any */}
                    {errors[field] && (
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
