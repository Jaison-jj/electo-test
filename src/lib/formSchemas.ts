import * as Yup from 'yup';

export const editProfileSchema = Yup.object().shape({
  firstName: Yup.string()
    .required('First name is required!')
    .matches(/^(?=.*[a-zA-Z])[a-zA-Z0-9]+$/, {
      message: 'Input is invalid!',
    }),
  lastName: Yup.string()
    .required('Last name is required!')
    .matches(/^(?=.*[a-zA-Z])[a-zA-Z0-9]+$/, {
      message: 'Input is invalid!',
    }),
  username: Yup.string().required('User name is required!'),
  dob: Yup.date().required('Date of birth is required'),
  gender: Yup.string().required('Gender is required!'),
  streetAddress: Yup.string().required('Street address is required!'),
  apartment: Yup.string(),
  city: Yup.string().required('City is required!'),
  state: Yup.string().required('State is required!'),
  zipCode: Yup.string()
    .matches(/^\d{5}$/, 'Invalid ZIP code format')
    .matches(/^\d+$/, 'ZIP code must contain only numbers')
    .required('ZIP code is required'),
  isPrivacyPolicyRead: Yup.boolean().oneOf(
    [true],
    'You must accept the terms and conditions',
  ),
  maritalStatus: Yup.string().required('Marital status is required!'),
  children: Yup.number()
    .transform((value, originalValue) => {
      if (originalValue === '' || isNaN(originalValue)) {
        return null;
      }
      return value;
    })
    .nullable()
    .min(0, 'Must be zero or greater.')
    .required('Required field'),
  employmentStatus: Yup.string().required('Employment status is required!'),
  educationLevel: Yup.string().required('Education level is required!'),
  jobIndustry: Yup.string().required('Job industry is required!'),
  race: Yup.string().required('Race is required!'),
  veteran: Yup.string().required('Veteran is required'),
  politicalViews: Yup.string().required('Political Views is required!'),
});
